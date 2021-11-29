<script>
	import {removeMaterialFromZoom} from "../../api/zoom-api";
	import AddPdfToZoomDialog from '../../components/task/add-pdf-to-zoom-dialog.svelte'
	import StudentDisplay from '../../components/tutor-group/students-display.svelte'
	import dayjs from 'dayjs'
	import {getContext, onMount} from 'svelte'
	import {tutor_group_store, tutor_group_category_cat_list_store} from "../../store";
	import {org_store} from "../../store";
	import Rate from './rate-zoom.svelte'
	import {listStudentNote} from "../../api/student-note-api";
	// import {stores} from '$app/stores'
	import {syllabus_store} from "../../store";
	import {listAllCategory, updateSyllabus} from "../../api/syllabus-api";
	import {fetchZoomOverview} from "../../api/zoom-api";
	import {getZoomDetails} from "../../api/zoom-api";

	// const {session} = stores()
	const {close} = getContext('simple-modal')

	import utc from "dayjs/plugin/utc.js"
	import timezone from "dayjs/plugin/timezone.js"
	import isBetween from 'dayjs/plugin/isBetween.js'
	dayjs.extend(utc)
	dayjs.extend(timezone)
	dayjs.extend(isBetween)

	export let z
	export let tutor_group_id
	export let is_overview = false
	export let onRateSuccess = () => {}

	import Icon from '../ui-elements/icon.svelte'
	import Dropdown from '../ui-elements/dropdown3.svelte'
	const {open} = getContext('simple-modal')
	let is_one_on_one = z.students.length === 1
	let student_id = is_one_on_one ? z.students[0].user_id : null
	let big_classroom_type = z.big_classroom_type
	let is_big_class = big_classroom_type === 'UNLIMITED' || big_classroom_type === 'BIG'

	const local_time_zone = dayjs.tz.guess()
	$: start = dayjs.utc(z.start_date).tz(local_time_zone)
	$: end = start ? start.add(z.duration, 'minutes') : null
	let now = dayjs(new Date())
	$: not_set = !z.start_date
	$: day_diff = start ? start.diff(now, 'day') : null
	$: is_today = day_diff === 0

	$: start_time_hk = dayjs.utc(z.start_date).tz('Asia/Hong_Kong')

	let in_progress
	let expired
	let not_yet_started
	let hour_diff
	let min_diff
	let within_hour
	let is_note_read = true
	let loading = false
	let student_cnt

	$: user_id = (is_one_on_one && z.students.length ===1) ? z.students[0].user_id : null
	$: student = tutor_group_store.getOOO(user_id)
	$: student_image = student ? student.avatar_filepath: null
	$: tutor_group = $tutor_group_store.entity.tutor_group[tutor_group_id] || {}

	$: status = not_set ? 'not_set' : expired ? 'expired' : in_progress ? 'in_progress' : within_hour ? 'in_hour' : is_today ? 'today' : 'coming_soon'
	$: zoom_button_active = (within_hour || in_progress)

	const status_to_style = {
		'not_set': 'bg-blue-100 text-red-500',
		'expired': 'bg-gray-200 text-gray-400',
		'in_progress': 'bg-yellow-500 text-black',
		'in_hour': 'bg-green-500 text-white',
		'today': 'bg-green-500 text-white',
		'coming_soon': 'bg-blue-100 text-blue-500'
	}

	const update = () => {
		now = dayjs(new Date())
		hour_diff = start.diff(now, 'hour')
		min_diff = start.diff(now, 'minute') % 60
		expired = now.isAfter(end)
		in_progress = now.isBetween(start, end)
		within_hour = start.diff(now, 'minute') < 60 && !expired && !in_progress
		not_yet_started = now.isBefore(start)
	}

	onMount(async () => {
		let timer_id
		update()
		if (is_today) {
			hour_diff = start.diff(now, 'hour')
			timer_id = setInterval(update, 1000)
		}
		// let res = await listStudentNote({
		// 	student_id, teacher_id: $session.user_id
		// })
		// is_note_read = res.is_note_read
		if (!$syllabus_store.length) {
			await listAllCategory()
		}
		let res = await getZoomDetails(z.wrapper_id, fetch)
		student_cnt = res.students.length
		return () => {
			if (timer_id) clearInterval(timer_id)
		}
	})

	const onAddMaterial = (type) => {
		// note: task start one day prior to zoom lesson so that student can preview the material beforehand
		let task_start_date = dayjs(z.start_date).add(-1, 'day').format('YYYY-MM-DD HH:mm:ss')
		open(AddPdfToZoomDialog, {
			tutor_group_id,
			wrapper_id: z.wrapper_id,
			student_id: user_id,
			task_start_date,
			category: type || z.category_type,
			selected_filter: z.category_level
		}, {
			styleWindow: {
				width: '960px'
			},
			styleContent: {
				padding: 0
			},
			closeOnOuterClick: false
		})
	}

	const onRemoveMaterial = (day_id) => {
		let day_ids = z.days.map(d => d.day_id)
		day_ids.splice(day_ids.indexOf(day_id), 1)
		removeMaterialFromZoom({
			wrapper_id: z.wrapper_id,
			day_ids
		})
	}

	const getLevelOptions = (category) => {
		let obj = $syllabus_store.find(s => {
			return s.category_type === category
		})
		return obj && obj.category_level || []
	}

	const onLevelSelect = async (level) => {
		loading = true
		await updateSyllabus({
			tutor_group_id,
			category_level: level,
			category_type: z.category_type
		})
		let start_date = dayjs(z.start_date).startOf('month')
		let end_date = dayjs(start_date).add(1, 'month')
		let data = await fetchZoomOverview({
			start_date: start_date.format('YYYY-MM-DD HH:mm:ss'),
			end_date: end_date.format('YYYY-MM-DD HH:mm:ss')
		})
		let new_zoom = data.find(zoom => zoom.wrapper_id === z.wrapper_id)
		loading = false
		z = new_zoom
		onRateSuccess()
	}
</script>

<div class="rounded-lg bg-white border border-gray-300 self-start" style="max-width: 400px">
	<div class="{status_to_style[status]} flex px-4 h-8 items-center rounded-t">
		{#if not_set}
			<p class="text-xs font-bold uppercase">No date</p>
			<div class="flex-1"></div>
		{:else if expired}
			<p class="text-xs font-bold uppercase">Class expired</p>
		{:else if not_yet_started}
			{#if within_hour}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{min_diff} minutes to start</p>
				</div>
			{:else if is_today}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{hour_diff} hours to start</p>
				</div>
			{:else}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{day_diff} days to start</p>
				</div>
			{/if}
			<div class="flex-1"></div>
		{:else if in_progress}
			<p class="text-xs font-bold uppercase">In progress</p>
		{/if}
	</div>
	<div class="p-4">
		<div class="flex items-center">
			{#if is_one_on_one}
				<div class="relative">
					{#if z.image_url !== $org_store.image_url}
						<img class="absolute -left-4 -top-3 w-9 h-9 border-2 shadow-lg border-white rounded-full" src={z.image_url} alt="org logo">
					{/if}
					<img src={student_image} alt="avatar" class="w-12 h-12 rounded-full">
				</div>
				<div class="ml-4 flex-1">
					{#if student}
						<a on:click={close} href="/tutor-group/{tutor_group.tutor_group_id}/message?user_id={user_id}" class="text-t2 flex items-center hover:text-blue-500">
							{student ? student.nickname : ''}
							<Icon name="right" className="w-4 ml-2"/>
						</a>
					{:else}
						<span class="text-gray-400">No student</span>
					{/if}
					<a on:click={close} href="/tutor-group/{tutor_group.tutor_group_id}/message?user_id={user_id}" class="hover:opacity-70 inline-block font-bold text-xs px-4 py-1 rounded-full text-white leading-none" style="background: {tutor_group.color || '#ccc'}">
						{z.title || 'No class title'}
					</a>
				</div>
				{#if student}
					<div class="ml-2">
						<a on:click={close} href="/student/{student.user_id}/note" class="bg-gray-200 hover:bg-gray-300 text-xs p-2 rounded text-center hover:text-blue-500 relative block">
							<Icon name="bell" className="mx-auto w-6 text-gray-500"/>
							<span>Reminder</span>
							{#if !is_note_read}
								<span class="block absolute w-3 h-3 rounded-full bg-red-500 top-0 right-0"></span>
							{/if}
						</a>
					</div>
				{/if}
			{:else if !!big_classroom_type}
				<p class="text-t2 font-bold mb-2">
					{is_big_class ? 'Big class:' : 'Small class:'}
					{#if student_cnt}<span class="ml-1">{student_cnt} student(s)</span>{/if}
				</p>
			{:else}
				<div class="relative">
					{#if z.image_url !== $org_store.image_url}
						<img class="absolute -left-4 -top-3 w-9 h-9 border-2 shadow-lg border-white rounded-full" src={z.image_url} alt="org logo">
					{/if}
					<Icon name="user-group" className="w-8 flex-shrink-0"/>
				</div>
				<div class="ml-4 flex-1">
					<a on:click={close} href="/tutor-group/{tutor_group.tutor_group_id}/app-tasks" class="text-t2 flex items-center hover:text-blue-500">
						{tutor_group.title}
						<Icon name="right" className="w-4 ml-2 flex-shrink-0"/>
					</a>
					{#if tutor_group.students}
						<StudentDisplay students={tutor_group.students} flex_wrap={true}/>
					{/if}
				</div>
				<a on:click={close} href="/tutor-group/{tutor_group.tutor_group_id}/note" class="bg-gray-200 hover:bg-gray-300 text-xs p-2 rounded text-center hover:text-blue-500 ml-2">
					<Icon name="reading"/>
					<span>Note</span>
				</a>
			{/if}
		</div>
	</div>

		<div class="px-4 pb-2">
			<div class="flex justify-center">
				<a target="_blank" href={z.zoom_link} class="block bg-gradient-to-b from-green-500 to-green-700 hover:opacity-80 text-white text-center px-12 py-2 rounded-full font-bold w-full">
					Join the class now ({z.duration} min)
				</a>
			</div>
<!--			<a href={z.zoom_link} class="hover:text-blue-500 block text-xs text-center mt-1 text-gray-400">{z.zoom_link || 'Error: Contact our stuff'}</a>-->
		</div>

	<div class="flex items-center text-center border-t border-b border-gray-300 bg-gray-100">
		<div class="flex-1 p-2">
			<div>
				<div class="inline-flex items-center text-xs mb-2">
					{#if !is_one_on_one}
						<Icon name="user-group"/>
					{:else}
						<img src={student_image} alt="avatar" class="w-5 h-5 rounded-full">
					{/if}
					<p class="border-b border-current ml-1">Hong Kong</p>
				</div>
			</div>
			<span class="text-t1">{start_time_hk.format('MMM D, H:mm')}</span>
		</div>
		<div class="flex-1 border-l p-2 border-gray-300">
			<div>
				<div class="inline-flex items-center text-xs mb-2">
					<img src="https://ehla-media-bucket.s3-ap-southeast-1.amazonaws.com/aUserProfiles/avatar/default_teacher_02.png" alt="avatar" class="w-5 h-5 rounded-full">
					<p class="border-b border-current ml-1">{local_time_zone.split('/')[1]}</p>
				</div>
			</div>
			<span class="text-t1">{start.format('MMM D, H:mm')}</span>
		</div>
	</div>
	{#if z.category_type}
		<div class="border-b border-gray-300 bg-white flex items-center justify-between bg-gray-100">
			<div class="px-2 leading-none">
				<p>{z.category_type}</p>
			</div>
			{#if $syllabus_store.length}
				<Dropdown offset={0} placement="bottom-end">
					<div slot="activator" class="cursor-pointer text-sm px-2 py-2 flex items-center hover:bg-gray-100 hover:text-blue-500">
						<span class="leading-none">{z.category_level}</span>
						<Icon name="edit" className="ml-2 w-4"/>
					</div>
					<div class="bg-white border border-gray-300 shadow-lg rounded w-72">
						{#each getLevelOptions(z.category_type) as level}
							<div on:click={() => {onLevelSelect(level)}} class="py-2 px-4 cursor-pointer hover:text-blue-500">{level}</div>
						{/each}
					</div>
				</Dropdown>
			{/if}
		</div>
	{/if}

	{#if !loading}
		{#if z.days.length}
			{#each z.days as lesson, idx}
				<div class="flex items-center border-b border-gray-200">
					<a on:click={close} href="/tutor-group/{tutor_group_id}/{lesson.day_id}{user_id ? `?user_id=${user_id}` : ''}"
					   class="flex-1 group transition-colors hover:bg-gray-200 h-16 px-4 flex items-center border-r border-gray-200">
						<Icon name="pdf" className="w-8"/>
						<p class="leading-tight flex-1 ml-2 group-hover:text-blue-500 ml-2">{lesson.title}</p>
						<Icon name="right" className="w-4 group-hover:text-blue-500"/>
					</a>
					{#if !big_classroom_type}
						<Dropdown placement="bottom-end" offset={0}>
							<button slot="activator" class="group w-8 h-16 flex items-center justify-center hover:bg-gray-200">
								<Icon className="w-4 group-hover:text-blue-500" name="more"/>
							</button>
							<div class="bg-white rounded shadow-lg border border-gray-300">
								<div on:click={() => {onRemoveMaterial(lesson.day_id)}} class="cursor-pointer text-sm px-4 py-2 flex hover:bg-gray-100 hover:text-blue-500">
									<span class="flex-1">Remove</span>
								</div>
								{#if z.category_type}
									<div on:click={onAddMaterial} class="cursor-pointer text-sm px-4 py-2 flex hover:bg-gray-100 hover:text-blue-500">
										<span class="flex-1">Add</span>
									</div>
								{:else}
									<Dropdown placement="right" offset={0}>
										<div slot="activator" class="cursor-pointer text-sm px-4 py-2 flex items-center hover:bg-gray-100 hover:text-blue-500">
											<span>Add</span>
											<Icon name="right2" className="ml-4 w-4"/>
											<span></span>
										</div>
										<div class="bg-white border border-gray-300 shadow-lg rounded w-72">
											{#each $tutor_group_category_cat_list_store as item}
												<div on:click={() => {onAddMaterial(item)}} class="py-2 px-4 cursor-pointer hover:text-blue-500">{item}</div>
											{/each}
										</div>
									</Dropdown>
								{/if}
							</div>
						</Dropdown>
					{/if}
				</div>
				{#if (in_progress || expired) && is_one_on_one}
					<Rate t_difficulty_rate={Number(lesson.t_difficulty_rate)} {student_id} item_id={lesson.item_id} {onRateSuccess}/>
				{/if}
			{/each}
		{:else if !expired}
			<div class="flex justify-center items-center text-sm py-4 text-gray-400">
				<Icon name="alert" className="text-red-500 w-4"/>
				<p class="ml-2">No material is set.</p>
				{#if z.category_type}
					<button class="text-blue-500 ml-1 border-b border-current font-bold">Create</button>
				{:else}
					<Dropdown caveat_visible>
						<button slot="activator" class="text-blue-500 ml-1 border-b border-current font-bold">Create</button>
						<div class="bg-white border border-gray-300 shadow-lg rounded">
							{#each $tutor_group_category_cat_list_store as item}
								<div on:click={() => {onAddMaterial(item)}} class="py-2 px-4 cursor-pointer hover:text-blue-500">{item}</div>
							{/each}
						</div>
					</Dropdown>
				{/if}
			</div>
		{/if}
	{:else}
		<p class="p-4">Loading...</p>
	{/if}
</div>