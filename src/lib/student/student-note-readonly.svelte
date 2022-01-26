<script>
	export let student_id
	export let readonly = false
	import {onMount} from "svelte";
	import {session} from "$app/stores";
	import {is_loading} from "$lib/store/is_loading.js";
	import Icon from "$lib/ui/icon.svelte";
	import Dropdown from "$lib/ui/dropdown3.svelte";
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
	const onDelete = (note) => {
		dialog.confirm({
			message: 'Delete this note',
			onConfirm: () => {
				return http.post(fetch, '/studentNoteApi/delete_student_note', {
					note_id: note.note_id
				}, {
					notification: 'Note deleted'
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
		{#each notes.slice(0,readonly ? 3 : 9999) as note, i}
			<div class:mb-2={i < notes.length - 1} class="py-2 bg-gray-50 border border-gray-200 rounded px-2">
				<div class="flex items-center text-xs text-gray-400 mb-0.5">
					<span>{dayjs(note.update_ts).format('DD MMM')} from</span>
					<span class="mx-1 text-gray-700">
									{#if note.teacher_id === $session.user_info.user_id}
										me
									{:else}
										{note.owner_nickname}
									{/if}
					</span>
					{#if !readonly}
						<div class="ml-auto">
							<Dropdown placement="bottom-end" activator_active_style="w-4 h-4 cc bg-blue-100 rounded-full">
								<div slot="activator">
									<Icon name="more" className="w-3"/>
								</div>
								<div class="dropdown">
									<div on:click={() => {onDelete(note)}} class="item">Delete</div>
								</div>
							</Dropdown>
						</div>
					{/if}
				</div>
				<p class="text-sm text-gray-700">{note.note}</p>
			</div>
		{/each}
	{:else}
		<div class="text-xs text-gray-400 pb-4">No notes</div>
	{/if}
	<div class="mt-4">
		{#if !readonly}
			<button on:click={onCreateNote} class="justify-center transition-colors group flex items-center text-sm bg-gray-50 text-blue-500 border border-gray-300 hover:border-blue-500 hover:bg-gray-100 px-4 py-2 leading-tight text-center rounded w-full">
				<div class="w-4 h-4 rounded-full cc bg-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-colors">
					<Icon name="add" className="w-2"/>
				</div>
				<p class="ml-2">Add new note</p>
			</button>
		{:else}
			<a href="/students/{student_id}/notes" class="text-sm text-blue-500 text-center block bg-gray-100 py-1 border border-gray-200 hover:border-blue-500">
				See all notes ({notes && notes.length})
			</a>
		{/if}
	</div>
{/if}