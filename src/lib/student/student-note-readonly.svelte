<script>
	export let student_id
	export let height = '200px'
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
	import {noticeCenterStore} from "$lib/store/notice-center-store.js";
	$: notes = $student_store[student_id]
	onMount(async () => {
		await student_store.fetchStudentNote(fetch, {student_id})
		if (!readonly) {
			await http.post(fetch, '/studentNoteApi/read_student_note', {
				student_id
			})
			await noticeCenterStore.fetchUnreadCount(fetch)
		}
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
			message: 'Do you want to delete this note',
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
	<div class="overflow-y-scroll" style="height: {height}">
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
	</div>
	<div class="">
		{#if !readonly}
			<div class="pt-2 mt-2">
				<button on:click={onCreateNote} class="justify-center transition-colors group flex items-center text-sm bg-blue-500 text-white border border-gray-300 hover:border-blue-500 hover:bg-blue-600 px-4 py-3 leading-tight text-center rounded w-full">
					<div class="w-4 h-4 rounded-full cc bg-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
						<Icon name="add" className="w-2"/>
					</div>
					<p class="ml-2">Add new note</p>
				</button>
			</div>
		{:else}
			<a href="/students/{student_id}/notes" class="text-sm text-blue-500 text-center block bg-gray-100 py-1 border border-gray-200 hover:border-blue-500 mt-2">
				See all notes ({notes && notes.length})
			</a>
		{/if}
	</div>
{/if}