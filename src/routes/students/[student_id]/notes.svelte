<script>
	import StudentNoteReadOnly from '$lib/student/student-note-readonly.svelte'
	import {page} from "$app/stores";
	$: student_id = $page.params.student_id
</script>

<div class="text-lg">
<StudentNoteReadOnly {student_id}/>
</div>