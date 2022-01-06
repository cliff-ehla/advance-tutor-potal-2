<script>
	export let student_id
	import {onMount} from "svelte";
	import {student_store} from "$lib/store/student.js";
	$: student_notes = $student_store[student_id]

	onMount(() => {
		student_store.fetchStudentNote(fetch, {
			student_id
		})
	})
</script>

<div class="bg-white p-4 rounded shadow-lg max-w-screen-sm border border-gray-300">
	<p class="font-bold mb-2">Arex</p>
	{#if student_notes}
		{#if student_notes.length}
			{#each student_notes as note}
				<p>{note.note}</p>
			{/each}
		{:else}
			<p>no note</p>
		{/if}
	{:else}
		<p>loading</p>
	{/if}
</div>