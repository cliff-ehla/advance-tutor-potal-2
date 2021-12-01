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
	import isToday from "dayjs/plugin/isToday";
	import Icon from '$lib/ui/icon.svelte'
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

<div class="px-4 flex h-16 items-center border-b border-gray-300 sticky top-0 bg-white">
	<button>Today</button>
	<button class="w-10 h-10 cc bg-gray-200 rounded text-blue-500">
		<svg viewBox="0 0 36 36" class="fill-current w-5"><path d="M11 14h25v8H11zM0 25h8v7H0zM11 25h25v7H11zM11 4h25v7H11zM0 4h8v7H0zM0 14h8v8H0z"></path></svg>
	</button>
	<button class="w-10 h-10 cc">
		<Icon name="calendar"/>
	</button>
</div>
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