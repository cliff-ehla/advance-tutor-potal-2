<script>
	import {getContext} from 'svelte'
	const {close} = getContext('simple-modal')

	export let message
	export let onConfirm = () => {}

	const onConfirmClick = () => {
		onConfirm(message)
		close()
	}
</script>

<p>Create note to student:</p>
<textarea rows="4" bind:value={message} class="w-96 px-2 py-4 border border-gray-300 rounded my-4" placeholder="Create note to student"/>

<div class="flex">
	<button on:click={close} class="flex-1 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-blue-500 rounded px-4 py-2">Cancel</button>
	<button on:click={onConfirmClick} class="flex-1 bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2 ml-4">Send</button>
</div>