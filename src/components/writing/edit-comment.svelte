<script>
	import CommentSvg from './comment-svg.svelte'
	export let comment_idx
	export let highlighted_text
	export let comment_text
	export let onDelete = () => {}
	export let onEdit = () => {}
	import {getContext} from 'svelte'
	const {close} = getContext('simple-modal')

	const onFocus = node => node.focus()

	const original_text = comment_text
	$: is_edit = comment_text !== original_text

	const onConfirmClick = () => {
		onEdit(comment_text)
		close()
	}

	const onDeleteClick = () => {
		onDelete()
		close()
	}

	const onKeydown = (e) => {
		const code = e.keyCode
		if (code === 13 && is_edit) {
			onConfirmClick()
		}
	}
</script>

<div class="px-4 py-2 rounded-t flex items-center text-yellow-700">
	<CommentSvg/>
	<p class="ml-2 flex-1">Edit Comment</p>
</div>
<div class="px-4 py-2">
	<div class="flex items-start mb-2">
		<div style="font-size: 0.6em" class="bg-blue-500 flex-shrink-0 w-4 h-4 flex items-center justify-center text-white font-bold rounded-full">{comment_idx}</div>
		<div class="inline-block ml-1">
			<p class="italic text-gray-400" style="font-size: 0.78em">{highlighted_text}</p>
		</div>
	</div>
	<textarea placeholder="comments" bind:value={comment_text} rows="4" class="border border-blue-500 rounded p-2 w-full h-full focus:outline-none" use:onFocus></textarea>
</div>
<div class="px-4 py-2 flex justify-between border-t border-gray-200 mt-2">
	<button on:click={onDeleteClick} class="text-red-500 hover:bg-red-500 hover:text-white border-gray-300 border rounded px-2 py-1">Delete</button>
	<button on:click={onConfirmClick} class="{is_edit ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-200 text-gray-400'} rounded px-2 py-1 ml-4">Edit</button>
</div>

<svelte:window on:keydown={onKeydown}/>
