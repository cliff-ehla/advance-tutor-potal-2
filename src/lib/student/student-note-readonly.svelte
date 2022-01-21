<script>
	import {http} from "$lib/http.js";

	export let student_id
	import {onMount} from "svelte";
	import {session} from "$app/stores";
	import {is_loading} from "$lib/store/is_loading.js";
	import dayjs from "dayjs";
	let notes
	onMount(async () => {
		const {data} = await http.post(fetch, '/studentNoteApi/list_student_note', {
			student_id
		})
		notes = data
	})
</script>

{#if $is_loading}
	loading...
{:else}
	{#if notes && notes.length}
		{#each notes as note}
			<div class="py-2 border-b border-gray-200">
				<div class="text-xs text-gray-400">
					<span>{dayjs(note.update_ts).format('DD MMM')} from</span>
					<span class="border-b border-gray-400 text-gray-700">
									{#if note.teacher_id === $session.user_info.user_id}
										me
									{:else}
										{note.owner_nickname}
									{/if}
					</span>
				</div>
				<p class="text-sm">{note.note}</p>
			</div>
		{/each}
	{:else}
		<div class="note">No notes</div>
	{/if}
{/if}