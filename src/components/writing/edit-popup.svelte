<script>
	import CommentSvg from './comment-svg.svelte'
	export let onConfirm = () => {}
	export let text = ''
	export let title = ''

	$: text_class = title === 'Comment' ? 'text-yellow-700' : 'text-blue-500'
	$: bg_class = title === 'Comment' ? 'bg-yellow-500' : 'bg-blue-500'
	$: border_class = title === 'Comment' ? 'border-yellow-700' : 'border-blue-500'

	let text_value = text || ''

	import {getContext} from 'svelte'
	const {close} = getContext('simple-popup')

	const onFocus = node => node.focus()

	const onkeydown = e => {
		const code = e.keyCode
		if (code === 13) {
			confirm()
		} else if (code === 8 && !text_value) {
			close()
		}
	}

	const confirm = () => {
		onConfirm(text_value)
		close()
	}

	const onCancelClick = () => {
		close()
	}

	const onConfirmClick = () => {
		confirm()
	}
</script>

<div class="border {border_class} bg-white shadow w-full rounded">
	{#if title === 'Comment'}
		<div class="px-2 py-2 rounded-t flex items-center text-yellow-700">
			<CommentSvg/>
			<p class="ml-2 text-sm">Comment</p>
		</div>
	{:else}
		<div class="px-2 py-0.5 rounded-t bg-blue-100 bg-opacity-50 text-blue-500">{title}</div>
	{/if}
	<textarea rows="2" placeholder={title} bind:value={text_value} class="rounded p-2 w-full h-full focus:outline-none" use:onFocus></textarea>
	<div class="px-2 py-1 flex justify-between border-t border-gray-200">
		<button on:click={onCancelClick} class="{text_class} border-gray-300 border rounded px-2 py-1">Cancel</button>
		<button on:click={onConfirmClick} class="{bg_class} text-white rounded px-2 py-1 ml-4">Confirm</button>
	</div>
</div>

<svelte:window on:keydown={onkeydown}/>
