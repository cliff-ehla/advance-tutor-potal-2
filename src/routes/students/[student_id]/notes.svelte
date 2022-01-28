<script>
	import StudentNoteReadOnly from '$lib/student/student-note-readonly.svelte'
	import {page} from "$app/stores";
	$: student_id = $page.params.student_id
</script>

<div class="section-box max-w-screen-sm mx-auto -mt-12">
	<h2 class="section-title text-lg mb-4">Notes</h2>
	<StudentNoteReadOnly height="calc(100vh - 450px)" {student_id}/>
</div>