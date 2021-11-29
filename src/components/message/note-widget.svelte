<script>
	import {listStudentNote, markAsRead, createStudentNote, deleteStudentNote} from "../../api/student-note-api";
	import {onMount} from 'svelte'
	import dayjs from "dayjs";
	import AddNoteDialog from './add-note-dialog.svelte'
	import Dropdown from '../ui-elements/dropdown3.svelte'
	import Icon from '../ui-elements/icon.svelte'
	import {getContext} from 'svelte'
	const {open} = getContext('simple-modal')
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()

	export let student_id
	export let teacher_id
	export let height = '200px'

	let notes
	let is_note_read
	let scroll_container_el

	onMount(() => {
		fetchNote()
	})

	const fetchNote = async () => {
		const res = await listStudentNote({
			student_id, teacher_id
		}, fetch)
		notes = res.notes
		notes = notes.sort((a,b) => {
			return a.update_ts > b.update_ts ? 1 : -1
		})
		is_note_read = res.is_note_read
		setTimeout(() => {
			scroll_container_el.scrollTop = scroll_container_el.scrollHeight
		}, 100)
		if (!res.is_note_read) {
			dispatch('unread')
		}
	}

	const onCreateNote = async () => {
		open(AddNoteDialog, {
			onConfirm: async (note) => {
				await createStudentNote({
					student_id,
					note,
					teacher_id
				}, fetch)
				await fetchNote()
			}
		})
	}

	const onDelete = async (note_id) => {
		await deleteStudentNote({note_id}, fetch)
		fetchNote()
	}

	export function markAsReadAndScroll () {
		markAsRead({
			student_id
		}, fetch)
		setTimeout(() => {
			scroll_container_el.scrollTop = scroll_container_el.scrollHeight
		}, 10)
	}
</script>

<div>
	<div bind:this={scroll_container_el} style="height: {height}" class="flex-1 overflow-y-scroll">
		{#if notes}
			{#if notes.length}
				{#each notes as note}
					<div class="bg-white rounded p-2 mb-2 relative">
						<p class="text-sm text-gray-400">
							{dayjs(note.update_ts).format('DD MMM')} from
							<span class="border-b border-gray-400 text-gray-700">
								{#if note.teacher_id === teacher_id}
									me
								{:else}
									{note.owner_nickname}
								{/if}
							</span>
						</p>
						<p>{note.note}</p>
						{#if note.teacher_id === teacher_id}
							<div class="absolute right-1 top-2">
								<Dropdown activator_style="rounded-full w-4 h-4 flex items-center justify-center"
								          placement="bottom-end"
								          activator_active_style="bg-white text-gray-700">
									<div slot="activator">
										<Icon name="more" className="w-4"/>
									</div>
									<div class="bg-white shadow-lg w-32">
										<div on:click={() => {onDelete(note.note_id)}} class="cursor-pointer px-4 py-2 text-gray-500 hover:text-red-500">
											Delete
										</div>
									</div>
								</Dropdown>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<p class="p-4">No data</p>
			{/if}
		{:else}
			<p class="p-4">Loading...</p>
		{/if}
	</div>
	<button on:click={onCreateNote} class="py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded w-full text-white mt-2">Create note</button>
</div>
