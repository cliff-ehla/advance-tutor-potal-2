<script>
	import RateLabel from '$lib/zoom/rate-label.svelte'
	export let zoom_list
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {getContext} from 'svelte'
	const {open, closeModal} = getContext('simple-modal')
	import PdfReaderDialog from '$lib/pdf-reader/pdf-reader-dialog.svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import {page} from "$app/stores";

	dayjs.extend(utc)
	const isPast = (zoom) => {
		return dayjs.utc(zoom.start_date).local().isBefore(dayjs())
	}
	const onPreview = (d) => {
		open(PdfReaderDialog, {
			item_id: d.item_id
		})
	}
</script>

<div>
{#each zoom_list as zoom, i}
	<div class="flex relative pb-2">
		<div class="z-10 flex-shrink-0 w-4 h-4 border border-green-500 rounded-full {!isPast(zoom) ? 'bg-white' : 'bg-green-500'}"></div>
		{#if i < zoom_list.length - 1}
			<div class="transform -translate-x-1/2 absolute w-0.5 bg-green-500 inset-y-0 ml-2 top-0 h-full"></div>
		{/if}
		<div class="ml-4">
			<p class="text-gray-500 text-sm">
				{dayjs(zoom.start_date).format('DD MMM, h:mma')}
			</p>
			<div>
				{#if zoom.days.length}
					{#each zoom.days as d}
						<div class="flex">
							<a use:tooltip={'Click to preview'}
							   href="/item/{d.item_id}"
							   class="cursor-pointer hover:text-blue-700 leading-tight">
								{d.title}
							</a>
							<div class="ml-2">
								{#if isPast(zoom)}
									<RateLabel student_id={$page.params.student_id} item_id={d.item_id} rate={d.t_difficulty_rate}/>
								{/if}
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-gray-300">- No material -</p>
				{/if}
			</div>
		</div>
	</div>
{/each}
</div>