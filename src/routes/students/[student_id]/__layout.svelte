<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_fans_detail_overview', {
			student_id: page.params.student_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				detail: data
			},
			stuff: {
				overview: data
			}
		}
	}
</script>

<script>
	import {tutor_group_store} from "../../../store";
	import {page, session} from '$app/stores'
	import NoteWidget from '../../../components/message/note-widget.svelte'
	import {capitalize} from "$lib/helper/capitalize.js";

	export let detail // TODO gender/ nickname/ level/ courses []/ upcoming_zoom_list []/ completed_zoom_list []/ last_lesson_date
	console.log('detail',detail)

	const student_id = $page.params.student_id
	$: student = $tutor_group_store ? tutor_group_store.getOOO(student_id) : null
	$: tutor_group_id = $page.params.tutor_group_id
	$:{
		console.log(student, $tutor_group_store, student_id)
	}
</script>

<div class="absolute">
	<div class="w-64 border-r border-gray-300">
		<div class="p-4">
			{#if student}
				<div class="mt-4 mb-4 text-center">
					<div class="w-20 h-20 rounded-full border-2 border-gray-300 mx-auto relative shadow">
						<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full">
						<div class="absolute -bottom-2 -right-4 ml-2 w-10 h-10 bg-blue-500 rounded-full cc text-white">{capitalize(student.level)}</div>
					</div>
					<div class="flex items-center justify-center mt-2">
						<p class="font-bold">{student.nickname}</p>
					</div>
				</div>
				<div class="py-4 border-gray-300 border-b border-t">
					<a href="/students/{student_id}/learning-history"
					   class:underline={$page.path.split('/').pop() === 'learning-history'}
					   class="text-sm uppercase block font-bold hover:text-blue-500">Learning history</a>
				</div>
				<div class="py-4 border-gray-300 border-b">
					<p class="text-sm uppercase mb-2 font-bold">Courses</p>
					{#each student.tutor_groups as course}
						<a href="/students/{student_id}/tutor-group/{course.tutor_group_id}"
						   class:underline={course.tutor_group_id === tutor_group_id}
						   class="mb-4 block hover:text-blue-500 text-sm">
							<p>{course.title.split('(')[0]}</p><!--						<p>{course.unread_message_cnt}</p>-->
						</a>
					{/each}
				</div>
			{/if}

			<div class="py-4">
				<p class="text-sm uppercase mb-2 font-bold">Notes</p>
				<div class="border border-gray-300">
					<NoteWidget height="226px" {student_id} teacher_id={$session.user_info.user_id}/>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="ml-64 p-4 bg-gray-100">
	<slot/>
</div>