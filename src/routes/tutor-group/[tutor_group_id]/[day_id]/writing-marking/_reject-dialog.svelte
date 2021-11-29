<script>
	import TemplateTextBox from './template-text-box.svelte'
	import {onMount, getContext} from 'svelte'
	import {listRejectCommentSample, rejectWriting} from "../../../../../api/writing-api";
	const {close} = getContext('simple-modal')

	export let onRejectSuccess = () => {}
	export let user_writing_id

	let text
	let loading
	let options

	const onReject = async () => {
		loading = true
		await rejectWriting({
			user_writing_id,
			reject_message: text
		})
		loading = false
		onRejectSuccess()
		close()
	}

	onMount(async () => {
		options = await listRejectCommentSample()
	})
</script>

<p class="font-bold mb-4">Reject the submission</p>

<div class="mb-4">
	{#if options}
		<TemplateTextBox label_key="message" {options} on:input={e => text = e.detail}/>
	{/if}
</div>

<div class="flex justify-end">
	<button class="{!loading ? 'bg-red-500' : 'bg-gray-300'}  text-white rounded px-8 py-2 hover:bg-opacity-90" on:click={onReject}>{loading ? 'Loading...' : 'Reject'}</button>
</div>
