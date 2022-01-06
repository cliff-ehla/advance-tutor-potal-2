<script>
	import {tutor_group_store} from "../../../store";
	import {page, session} from '$app/stores'
	import NoteWidget from '../../../components/message/note-widget.svelte'

	const student_id = $page.params.student_id
	$: student = $tutor_group_store ? tutor_group_store.getOOO(student_id) : null
</script>

<div class="absolute">
	<div class="w-64">
		<div class="p-4">
			{#if student}
				<div class="mb-4 text-center">
					<div class="w-20 h-20 rounded-full border border-gray-300 mx-auto"></div>
					<p class="font-bold">{student.nickname}</p>
					<p>{student.level} {student.gender}</p>
				</div>
				{#each student.tutor_groups as course}
					<a href="/students/{student_id}/tutor-group/{course.tutor_group_id}" class="mb-4 block hover:text-blue-500">
						<p class="font-bold">{course.title}</p>
						<div class="flex">
							<p>{course.completion_cnt} / {course.total_lesson_cnt}</p>
							<p>{course.unread_message_cnt}</p>
						</div>
					</a>
				{/each}
			{/if}
			<p>Notes</p>
			<div class="border border-gray-300">
				<NoteWidget height="226px" {student_id} teacher_id={$session.user_info.user_id}/>
			</div>
			<a href="/students/{student_id}/learning-history">Learning history</a>
		</div>
	</div>
</div>

<div class="ml-64 p-4">
	<slot/>
</div>