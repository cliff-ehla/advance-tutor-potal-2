<script>
	import {course_store} from "$lib/store/course.js";
	import {onMount} from "svelte";
	import dayjs from "dayjs";
	import RateLabel from '$lib/zoom/rate-label.svelte'
	export let zoom_list
	export let tutor_group_id
	$: zoom_list = $course_store[tutor_group_id]

	onMount(() => {
		course_store.fetchZoomList(fetch, {tutor_group_id})
	})

	$: completed_count = zoom_list ? zoom_list.filter(z => isPast(z)).length : 0
	$: total_count = zoom_list ? zoom_list.length : 0

	const isPast = (zoom) => {
		return dayjs.utc(zoom.start_date).local().isBefore(dayjs())
	}
</script>


<div class="bg-white p-4 shadow-lg rounded text-xs border border-gray-300">
	<div class="mb-2">
		{completed_count} / {total_count} completed
	</div>
	<div class="overflow-auto" style="max-height: 1000px;">
		{#if zoom_list}
			{#each zoom_list as zoom, i}
				<div class="flex relative pb-2">
					<div class="w-4 h-4 border border-green-500 rounded-full {!isPast(zoom) ? 'bg-white' : 'bg-green-500'}">
						{#if i < zoom_list.length - 1}
							<div class="absolute w-0.5 bg-green-500 inset-y-0 ml-1.5 top-1/2 h-full"></div>
						{/if}
					</div>
					<div class="ml-4">
						<p class="text-gray-500">
							{dayjs(zoom.start_date).format('DD MMM, h:mma')}
						</p>
						<div>
							{#if zoom.days.length}
								{#each zoom.days as d}
									<div class="cursor-pointer hover:text-blue-700 hover:bg-gray-200 flex items-center mb-1 group rounded">
										<p class="leading-tight">{d.title}</p>
										<div class="ml-2">
											<RateLabel rate={d.t_difficulty_rate}/>
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
		{/if}
	</div>
</div>

<style>

</style>