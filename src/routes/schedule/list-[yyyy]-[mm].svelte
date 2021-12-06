<script context="module">
	export const load = ({stuff}) => {
		return {
			props: {
				zoom_list: stuff.zoom_list
			}
		}
	}
</script>

<script>
	export let zoom_list
	import dayjs from "dayjs";
	import ZoomPreview from '$lib/zoom/zoom-preview.svelte'
	import isToday from "dayjs/plugin/isToday.js";
	import isBetween from "dayjs/plugin/isBetween.js";
	import {page} from '$app/stores'
	dayjs.extend(isToday)
	dayjs.extend(isBetween)
	$: date_key = `${$page.params.yyyy}-${$page.params.mm}-01`

	const groupByDate = (zoom_list) => {
		let results = []
		zoom_list.forEach(z => {
			if (dayjs(z.start_date).isSame(date_key, 'month')) {
				let date = dayjs(z.start_date).format('YYYY-MM-DD')
				let obj = results.find(r => r.date === date)
				if (!obj) {
					results.push({
						date,
						zoom_list: [z]
					})
				} else {
					obj.zoom_list.push(z)
				}
			}
		})
		return results
	}

	$: zoom_list_by_date = date_key ? groupByDate(zoom_list) : []
</script>

{#each zoom_list_by_date as date}
	<div class="flex border-b border-gray-300 items-start" class:bg-blue-200={dayjs(date.date).isToday()}>
		<div class="w-32 p-2 flex items-end">
			<p class="font-bold w-8 flex justify-center">{dayjs(date.date).format('D')}</p>
			<p class="text-xs uppercase">{dayjs(date.date).format('MMM, ddd')}</p>
		</div>
		<div class="w-full">
			{#each date.zoom_list as z}
				<ZoomPreview zoom={z}/>
			{/each}
		</div>
	</div>
{/each}