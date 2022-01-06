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
</script>


<div class="bg-white p-2 shadow-lg rounded text-xs border border-gray-300">
	{#if zoom_list}
		{#each zoom_list as zoom}
			<div class="flex relative pb-0.5">
				<div class="w-4 h-4 rounded-full bg-green-500">
					<div class="absolute w-0.5 bg-green-500 inset-y-0 ml-1.5 top-1/2 h-full"></div>
				</div>
				<div class="ml-4">
					<p class="text-gray-500" class:opacity-50={dayjs(zoom.start_date).isBefore(dayjs())}>
						{dayjs(zoom.start_date).format('DD MMM, h:mma')}
					</p>
					<div>
						{#each zoom.days as d}
							<div on:click={() => {previewMaterial(d)}} class="cursor-pointer hover:text-blue-700 hover:bg-gray-200 flex items-center mb-1 group rounded">

								<p class="leading-tight">{d.title}</p>
								<div class="w-14 flex-shrink-0 ml-auto">
									<div class="bg-white px-2 rounded-full text-xs ml-auto hidden group-hover:block">Preview</div>
								</div>
								<RateLabel rate={d.t_difficulty_rate}/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
