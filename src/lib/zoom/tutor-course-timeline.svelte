<script>
	export let existing_classroom
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import PdfReaderDialog from '$lib/pdf-reader/pdf-reader-dialog.svelte'
	import {getContext} from 'svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";

	const {openModal, closeModal} = getContext('simple-modal')
	dayjs.extend(utc)
	const isPast = (classroom) => {
		return dayjs.utc(classroom.start_date).local().isBefore(dayjs())
	}
	const onPreview = (item_id) => {
		openModal(PdfReaderDialog, {
			item_id
		}, {
			padding: 0,
			bg_class: 'transparent',
			width: '100%',
			closeButton: false
		})
	}
</script>

{#each existing_classroom as classroom, i}
	<div class="flex relative pb-2">
		<div class="cc z-10 flex-shrink-0 w-4 h-4 border border-green-500 rounded-full {!isPast(classroom) ? 'bg-white' : 'bg-green-500'}"></div>
		{#if i < existing_classroom.length - 1}
			<div class="transform -translate-x-1/2 absolute w-0.5 bg-green-500 inset-y-0 ml-2 top-0 h-full"></div>
		{/if}
		<div class="ml-4">
			<p class="text-gray-500 text-sm">
				<span>{dayjs.utc(classroom.start_date).local().format('DD MMM (ddd), h:mma')}</span>
			</p>
			<div use:tooltip={'Preview'} on:click={() => {onPreview(classroom.item_id)}} class="cursor-pointer hover:text-blue-700 text-xs">{classroom.title}</div>
		</div>
	</div>
{/each}