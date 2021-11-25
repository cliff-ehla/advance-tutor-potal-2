<script context="module">
	import {getStudentLessonList} from "../../../../api/tutor-api";
	export async function load({session, page, fetch}) {
		const user_id = page.query.get('user_id')
		if (!session) {
			this.redirect(302, '/login')
		} else {
			if (user_id) {
				let d = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
				console.log('cliff: ', d)
			} else {
				// getTutorGroupLessonList(page.params.tutor_group_id, this.fetch)
				// getTutorGroupStudentList(page.params.tutor_group_id, this.fetch)
			}
		}
		return true
	}
</script>

<script>
	import {org_store} from "../../../../store";
	import {tutor_group_store} from "../../../../store";
	import {stores} from "$app/stores";
	import Icon from '../../../../components/ui-elements/icon.svelte'
	import {formatDate} from "../../../../helpers/date";
	import TopBar from '../../../../components/top-bar.svelte'
	import CourseBreadcrumb from '../../../../components/course-breadcrumb.svelte'
	import StudentTopBar from '../../../../components/student-top-bar.svelte'
	import {lesson_type as lesson_type_map, task_type as task_type_map} from "../../../../store";
	import WritingStatusBanner from './_writing_status_banner.svelte'
	import {getRejectHistory} from "../../../../api/writing-api";
	// import tippy from "tippy.js";

	const {session, page} = stores()

	$: tutor_group_id = $page.params.tutor_group_id
	$: dict = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = dict && dict.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : null
	$: tasks = lesson && lesson.lesson
	$: lesson_idx = lessons && lessons.indexOf(lesson) + 1
	$: completed_users = lesson && lesson.completed_users
	$: not_completed_users = lesson && lesson.not_completed_users
	$: students = lesson && lesson.students
	$: lesson_type = $lesson_type_map[lesson && lesson.type]
	$: user_id = $page.query.user_id
	$: c_id = $page.query.c_id
	$: zoom_id = $page.query.zoom_id
	$: is_one_on_one = !!user_id
	$: is_group = !is_one_on_one
	$: is_school = $org_store.o_type === 'SCHOOL'
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO(user_id) : null
	$: is_writing_lesson = lesson ? ['writing', 'writing-ai'].includes(lesson.type) : null
	$: one_on_one_writing_marking_task = (is_one_on_one && is_writing_lesson && tasks) ? tasks.find(t => t.lesson_type === 'writing_marking_report') : null

	let reject_history = []

	const get_path = (task) => {
		const type = task.lesson_type
		let url
		if (['preview_word', 'reading'].includes(type)) {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/item/${task.item_id}/${task.lesson_type}`
		} else if (type === 'lesson_webview') {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/item/${task.item_id}/${task.lesson_type}?page=${task.page}`
		} else if (type === 'video') {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/video/?item_ids=${task.item_ids}`
		} else if (type === 'reading-pdf') {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/item/${task.item_id}/reading-pdf`
		} else if (task.result_id && type === 'grammar_exercise') {
			// TODO
			// url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/grammar-report/${task.result_id}`
		} else if (type === 'vocabulary-dictation' || type === 'chapter-dictation') {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/vocab/${task.vocab_list_id}/preview`
		} else if (type === 'article-dictation' || type === 'read-along') {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/article/${task.article_id}/preview`
		} else if (type === 'writing-ai') {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/instruction`
		} else if (type === 'baby_task') {
			url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/item/${task.item_id}/baby`
		}
		if (url && is_one_on_one) {
			if (url.includes('?')) {
				url += `&user_id=${user_id}`
			} else {
				url += `?user_id=${user_id}`
			}
		}
		if (url && is_school) {
			url += `?c_id=${c_id}`
		}
		if (url && zoom_id) {
			url += `?zoom_id=${zoom_id}`
		}
		return url
	}

	const get_report_path = task => {
		const type = task.lesson_type
		let url
		if (task.is_completed) {
			if (type === 'audio-feedback') {
				url = `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/audio-submission`
			} else if (type === 'article-dictation') {
				url = `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/article/${task.article_id}/dictation-result`
			} else if (type === 'read-along') {
				url = `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/article/${task.article_id}/speaking-result`
			} else if (task.vocab_result) {
				url = `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/vocab-report`
			} else if (type === 'vocabulary-dictation' || type === 'chapter-dictation') {
				url =  `/tutor-group/${tutor_group_id}/${lesson.day_id}/task/${task.lesson_id}/vocab/${task.vocab_list_id}/result`
			} else if (type === 'writing_marking_report') {
				url =  `tutor-group/${tutor_group_id}/${lesson.day_id}/writing-marking/${task.identifier}`
			}
		}
		if (url && is_one_on_one) url += `?user_id=${user_id}`
		return url
	}

	const onGetHistory = async (e, student) => {
		let saved_message_obj = reject_history.find(h => h.child_id === student.user_id)
		let message = saved_message_obj ? saved_message_obj.message : null

		if (!message) {
			let result = await getRejectHistory({
				tutor_group_id: $page.params.tutor_group_id,
				day_id: $page.params.day_id,
				child_id: student.user_id
			})
			message = result[0] && result[0].reject_message
		}

		reject_history.push({
			child_id: student.user_id,
			message
		})

		// TODO
		// tippy(e.target, {
		// 	content: message,
		// 	placement: 'top'
		// })
	}

	const status_to_bg_color = {
		0: 'bg-gray-300',
		1: 'bg-yellow-500',
		2: 'bg-green-500',
		3: 'bg-green-500',
		4: 'bg-red-500',
	}
	const status_to_label = {
		0: 'Not yet submit',
		1: 'Submitted',
		2: 'Marked',
		3: 'Marked',
		4: 'Rejected',
	}
</script>

{#if user_id && o_o_o}
	<StudentTopBar segment="course" {o_o_o}/>
	<CourseBreadcrumb {user_id} {dict} {lesson_type} {lesson}/>
{:else if c_id}
	<TopBar back_path="/tutor-group/{tutor_group_id}/app-tasks?c_id={c_id}">
		<div class="inline-flex items-center">
			<a href="/classes/{c_id}" class="w-12 h-12 rounded flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white text-t1">
				{$tutor_group_store ? tutor_group_store.getClassName(c_id) : ''}
			</a>
			<h1 class="ml-4 font-bold text-t1">
				{dict.title}
			</h1>
		</div>
	</TopBar>
{:else}
	<TopBar back_path></TopBar>
{/if}

<div class="bg-white border-b border-gray-300">
	<div class="max-w-screen-lg flex px-4 py-8">
		{#if is_one_on_one}
			{#if lesson_type}
				<div class="inline-flex px-2 items-center">
					<div class="w-16 h-16 rounded-full cc {lesson_type.color} text-white">
						<Icon className="w-12" name="{lesson_type.icon}"/>
					</div>
					<div class="ml-4">
						<p class="text-blue-500 font-bold text-sm">{lesson_type.title}</p>
						<p class="text-t1 font-bold">{lesson.title}</p>
						<p class="text-sm mt-2">Start at: {#if lesson}{formatDate(lesson.start_time)}{/if}</p>
					</div>
				</div>
			{/if}
		{:else if is_group}
			{#if lesson}
				<div class="px-2">
					<p class="font-bold text-t1 text-blue-500">{lesson.title}</p>
					<p>{lesson.description}</p>
					<p>{#if lesson}Start at: {formatDate(lesson.start_time)}{/if}</p>

					{#if is_writing_lesson}
						{#if tasks && tasks.length && tasks[0]}
							<div class="flex mt-2 hover:text-blue-500">
								<a href={get_path(tasks[0])}>Writing requirement</a>
								<Icon name="right" className="w-4 ml-2"/>
							</div>
						{/if}
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>

{#if one_on_one_writing_marking_task && one_on_one_writing_marking_task.identifier}
	<WritingStatusBanner tutor_group_id={tutor_group_id} day_id={lesson.day_id} task={one_on_one_writing_marking_task} {user_id}/>
{:else if is_writing_lesson}
	<p class="p-4">Pending student writing submission</p>
{/if}

<div>

	{#if lesson && is_writing_lesson && !is_one_on_one}
		{#if students}
			{#each students as s}
				<a href={[1,2,3,4].includes(s.status) ? `tutor-group/${$page.params.tutor_group_id}/${$page.params.day_id}/writing-marking/${s.identifier}?c_id=${c_id}` : null} class="block p-4 border-b border-gray-200 grid grid-cols-4 items-center gap-2 group hover:bg-gray-100 w-full bg-white">
					<div class="col-span-2 flex items-center">
						<img class="w-12 h-12 rounded-full" src={s.avatar_filepath} alt="hi"/>
						<div class="ml-4 flex-2">
							{s.username}
						</div>
					</div>
					<div class="col-span-1 flex justify-center">
						<div class="pr-4 pl-3 h-8 inline-flex items-center rounded-sm {s.status == 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'} border-gray-300 text-sm border">
							<div class="w-2.5 h-2.5 rounded-full {status_to_bg_color[s.status]}"></div>
							<div class="ml-2">{status_to_label[s.status]}</div>
							{#if s.status === 4}
								<div on:mouseover={(e) => {onGetHistory(e, s)}} class="w-4 h-4 flex items-center justify-center border border-gray-300 rounded-full ml-2 hover:text-blue-500 hover:border-current">
									<Icon name="info" className="w-2"/>
								</div>
							{/if}
						</div>
					</div>
					<div class="col-span-1 flex justify-end">
						{#if s.status == 1}
							<button class="group-hover:bg-blue-700 px-4 h-10 inline-flex items-center justify-center rounded bg-blue-500 text-white font-bold">
								Mark
							</button>
						{:else if s.status == 2 || s.status == 3}
							<button class="group-hover:bg-blue-500 group-hover:text-white px-4 h-10 inline-flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-blue-500 text-white">
								Edit
							</button>
						{/if}
					</div>
				</a>
			{/each}
		{/if}
	{:else if !is_writing_lesson}
		<div class="flex-1 px-8 py-4">
			{#if tasks}
				{#each tasks as t, i}
					{#if !['writing_exercise', 'writing_marking_report'].includes(t.lesson_type)}
						<div class="flex mb-4 items-center">
							<div class="w-8 flex-shrink-0 relative self-stretch flex items-center mr-4">
								<div class="relative z-10 w-8 h-8 rounded-full cc text-white {t.is_completed ? 'bg-green-500' : 'bg-gray-300'}">
									<Icon name="tick" className="w-4"/>
								</div>
								{#if i !== 0}
									<div class="w-1 inset-y-0 bg-opacity-50 {t.is_completed ? 'bg-green-500' : 'bg-gray-300'} absolute bottom-1/2 -top-1/2 left-1/2 -ml-0.5"></div>
								{/if}
							</div>
							<a href={get_path(t)}
							   class="{get_path(t) ? 'hover:shadow transform hover:-translate-y-1 transition-all group' : ''} flex-1 block bg-white border border-gray-300 rounded-lg flex items-center overflow-hidden">
								<div class="px-6 py-6 flex items-center flex-1">
									{#if t.thumbnail_path && t.lesson_type !== 'lesson_webview'}
										<img class="w-28 rounded" src={t.thumbnail_path} alt="icon">
									{:else}
										<div class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
											<Icon name={$task_type_map[t.lesson_type] && $task_type_map[t.lesson_type].icon}/>
										</div>
									{/if}
									<div class="mx-4 flex-1">
										<p class="font-bold group-hover:text-blue-500">{t.title}</p>
										<p class="text-sm text-gray-500 leading-tight">{t.description}</p>
									</div>
								</div>
								<div class="{get_path(t) ? 'text-gray-500' : 'text-gray-300'} ml-4 self-stretch px-4 py-2 bg-gray-200 group-hover:bg-blue-300 group-hover:text-white border-l border-gray-300 inline-flex items-center">
									<Icon className="w-4 opacity-80" name="right"/>
								</div>
							</a>
							{#if get_report_path(t)}
								<a href={get_report_path(t)} class="hover:shadow transform hover:-translate-y-1 transition-all shadow-inner rounded-lg ml-2 self-stretch px-4 py-2 bg-green-500 hover:bg-green-700 text-white inline-flex items-center">
									<div>
										<Icon className="w-10 mx-auto" name="report"/>
										<p class="mt-2 text-sm font-bold">Result</p>
									</div>
								</a>
							{/if}
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}
</div>
