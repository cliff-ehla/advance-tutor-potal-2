<script>
	import StudentNoteReadOnly from '$lib/student/student-note-readonly.svelte'
	import {page} from "$app/stores";
	$: student_id = $page.params.student_id
</script>

<div class="section-box">
	<h2 class="section-title text-lg mb-2">Notes</h2>
	<StudentNoteReadOnly {student_id}/>
</div>