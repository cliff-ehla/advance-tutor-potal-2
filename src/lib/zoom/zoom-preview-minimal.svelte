<!-- used inside student overview -->

<script>
	import dayjs from "dayjs";
	import PdfReaderDialog from '$lib/pdf-reader/pdf-reader-dialog.svelte'
	import RateLabel from '$lib/zoom/rate-label.svelte'
	import {getContext} from "svelte";
	const {open} = getContext('simple-modal')
	import {tooltip} from "$lib/aciton/tooltip.js";

	export let zoom

	const previewMaterial = async (d) => {
		open(PdfReaderDialog, {
			item_id: d.item_id
		})
	}
</script>


<div class="flex">
	<div class="flex-shrink-0">
		<div class="w-8 h-12 cc bg-gray-100 leading-tight text-center">
			<div>
				<p class="text-gray-500">{dayjs(zoom.start_date).format('DD')}</p>
				<p class="text-gray-500 text-xs">{dayjs(zoom.start_date).format('MMM')}</p>
			</div>
		</div>
	</div>
	<div class="ml-2">
		<div class="italic text-xs text-gray-400">
			{#if zoom.is_big_classroom}
				<div class="text-gray-500">{zoom.sub_cat}</div>
			{:else}
				<a href="/students/{zoom.students[0].user_id}/tutor-group/{zoom.tutor_group_id}">
					{zoom.title.split('(')[0]}
				</a>
			{/if}
		</div>
		{#each zoom.days as d}
			<div>
				<div class="inline-flex items-center cursor-pointer hover:text-yellow-700 mb-1">
					<p use:tooltip={'Preview material'} on:click={() => {previewMaterial(d)}} class="leading-tight mr-2">{d.title}</p>
					<!--				<RateLabel rate={d.t_difficulty_rate}/>-->
				</div>
			</div>
		{/each}
	</div>
</div>
