<script>
	import {createEventDispatcher} from 'svelte'
	import Icon from '../ui-elements/icon.svelte'
	const dispatch = createEventDispatcher()
	import {setCourseNote} from "../../api/course-api";

	export let note
	export let tutor_group_id = undefined

	let loading
	let is_editing
	let textarea_el

	const onSave = async () => {
		if (loading) return
		loading = true
		await setCourseNote({
			tutor_group_id,
			message: note
		}, fetch)
		loading = false
		is_editing = false
	}

	const onEditMode = () => {
		textarea_el.focus()
		is_editing = true
	}

	const onCancelEdit = () => {
		is_editing = false
	}
</script>

<div class="border border-gray-300 rounded bg-white overflow-hidden relative">
	{#if !is_editing}
		<button on:click={onEditMode} class="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-500 text-white flex justify-center items-center">
			<Icon name="edit" className="w-4"/>
		</button>
	{/if}
	<textarea placeholder="Note to the class" bind:this={textarea_el} readonly={!is_editing} bind:value={note} class="p-8 w-full focus:outline-none" cols="30" rows="10"/>
	{#if is_editing}
		<div class="px-4 py-2 flex justify-end border-t border-gray-300">
			<button on:click={onCancelEdit} class="hover:bg-gray-300 rounded px-4 py-2">
				Cancel
			</button>
			<button on:click={onSave} class="{(note && !loading) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'} rounded px-4 py-2">
				{loading ? 'Saving...' : 'Save'}
			</button>
		</div>
	{/if}
</div>