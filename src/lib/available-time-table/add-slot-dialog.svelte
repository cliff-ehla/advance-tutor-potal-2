<script>
	import dayjs from "dayjs";
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	export let start
	export let end
	const YYYY_MM_DD = dayjs(start).format('YYYY-MM-DD')
	let HH_MM_start = dayjs(start).format('HH:mm')
	let HH_MM_end = dayjs(end).format('HH:mm')
	export let onConfirm = () => {}
	import Button from '$lib/ui/button.svelte'

	const onConfirmClick = () => {
		let _start = `${YYYY_MM_DD} ${HH_MM_start}:00`
		let _end = `${YYYY_MM_DD} ${HH_MM_end}:00`
		onConfirm({
			start: _start,
			end: _end
		})
		closeModal()
	}
</script>

<p class="mb-4 mt-8">Add time slot on {dayjs(start).format('dddd')}</p>
<div class="flex">
	<div>
		<p class="note">Start time</p>
		<input class="w-24 px-2 py-1 border border-gray-300 rounded hover:border-gray-500" type="text" bind:value={HH_MM_start}>
	</div>
	<div class="ml-4">
		<p class="note">End time</p>
		<input class="w-24 px-2 py-1 border border-gray-300 rounded hover:border-gray-500" type="text" bind:value={HH_MM_end}>
	</div>
</div>
<div class="flex justify-end mt-6">
	<Button on:click={onConfirmClick}>Confirm</Button>
</div>