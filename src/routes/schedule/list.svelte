<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({session, fetch}) => {
		if (!session.user_info) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		const {success, data, debug} = await http.post(fetch, '/zoomApi/zoom_list_all')
		if (!success) return onFail(debug)
		return {
			props: {
				zoom_list: data
			}
		}
	}
</script>

<script>
	export let zoom_list
	import dayjs from "dayjs";
	import ZoomPreview from '$lib/zoom/zoom-preview.svelte'
	import isToday from "dayjs/plugin/isToday.js";
	dayjs.extend(isToday)

	const groupByDate = (zoom_list) => {
		let results = []
		zoom_list.forEach(z => {
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
		})
		return results
	}

	let zoom_list_by_date = groupByDate(zoom_list)
</script>

{#each zoom_list_by_date as date}
	<div class="flex border border-gray-200 items-start" class:bg-blue-200={dayjs(date.date).isToday()}>
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