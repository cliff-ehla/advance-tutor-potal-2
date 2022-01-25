<script>
	export let student_id
	import {onMount} from "svelte";
	import {session} from "$app/stores";
	import {is_loading} from "$lib/store/is_loading.js";
	import Icon from "$lib/ui/icon.svelte";
	import dayjs from "dayjs";
	import {dialog} from "$lib/store/dialog.js";
	import {student_store} from "$lib/store/student.js";
	import {http} from "$lib/http.js";
	$: notes = $student_store[student_id]
	onMount(() => {
		student_store.fetchStudentNote(fetch, {student_id})
	})
	const onCreateNote = () => {
		dialog.confirm({
			title: 'Add new note',
			text_input: {
				value: '',
				placeholder: 'Type your note here...'
			},
			onConfirm: ({text_input}) => {
				return http.post(fetch, '/studentNoteApi/set_student_note', {
					student_id,
					teacher_id: $session.user_info.user_id,
					note: text_input
				}, {
					notification: 'New note for student created'
				})
			},
			onSuccess: () => {
				student_store.fetchStudentNote(fetch, {student_id})
			}
		})
	}
</script>

{#if $is_loading}
	loading...
{:else}
	{#if notes && notes.length}
		{#each notes as note, i}
			<div class:border-b={i < notes.length - 1} class="py-2 border-b border-gray-200">
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
	<button on:click={onCreateNote} class="transition-colors group flex items-center text-sm bg-gray-50 text-blue-500 border border-gray-300 hover:border-blue-500 hover:bg-gray-100 px-4 py-1 leading-tight text-center rounded">
		<div class="w-4 h-4 rounded-full cc bg-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-colors">
			<Icon name="add" className="w-2"/>
		</div>
		<p class="ml-2">Add new note</p>
	</button>
{/if}