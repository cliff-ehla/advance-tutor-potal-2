<script>
	import {page} from "$app/stores";
	import {course_list_store} from "$lib/store/course_list_store.js";
	import MessageWidget from '$lib/message/message-widget.svelte'
	$: tutor_group_id = $page.params.tutor_group_id
	$: tutor_group = $course_list_store ? course_list_store.getTutorGroup(tutor_group_id) : undefined
	$: student = $course_list_store ? course_list_store.getStudent(tutor_group_id) : undefined
	$: student_id = student && student.id
</script>

{#if tutor_group}
	<a href="/students/{student_id}/tutor-group/{tutor_group_id}">{tutor_group.title}</a>
{/if}
{#if student_id && tutor_group_id}
	<MessageWidget crazy_fetch={false} {tutor_group_id} {student_id} height="calc(200px)"/>
{/if}