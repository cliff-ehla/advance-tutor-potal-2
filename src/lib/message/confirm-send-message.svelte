<script>
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	export let message
	export let onConfirm

	const onConfirmClick = () => {
		onConfirm()
		closeModal()
	}
</script>

<p>Send message:</p>
<p class="px-2 py-4 border border-gray-200 rounded my-4">{message}</p>

<div class="flex">
	<button on:click={closeModal} class="flex-1 text-gray-500 hover:bg-gray-100 hover:text-blue-500 rounded px-4 py-2">Cancel</button>
	<button on:click={onConfirmClick} class="flex-1 bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2 ml-4">Send</button>
</div>