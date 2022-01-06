<script context="module">
	import {course_store} from "$lib/store/course.js";

	export const load = async ({page, fetch}) => {
		await course_store.fetchZoomList(fetch, {
			tutor_group_id: page.params.tutor_group_id
		})
		return true
	}
</script>

<script>
	export let zoom_list
	import {page} from "$app/stores";
	import dayjs from "dayjs";
	import {tutor_group_store} from "../../../store/index.js";
	import RateLabel from '$lib/zoom/rate-label.svelte'
	$: tutor_group_id = $page.params.tutor_group_id
	$: tutor_group = $tutor_group_store.tutor_group[tutor_group_id]

	$:{
		console.log(tutor_group)
	}
</script>

<h1 class="font-bold">{tutor_group && tutor_group.title}</h1>
<div class="p-4 bg-gray-200">
	<div class="bg-white p-4">
		{#each $course_store[$page.params.tutor_group_id] as zoom}
			<div class="flex relative py-2">
				<div class="w-6 h-6 rounded-full bg-green-500">
					<div class="absolute w-0.5 bg-green-500 inset-y-0 ml-2.5 top-1/2 h-full"></div>
				</div>
				<div class="ml-4">
					<p class="text-gray-500" class:opacity-50={dayjs(zoom.start_date).isBefore(dayjs())}>
						{dayjs(zoom.start_date).format('DD MMM, h:mma')}
					</p>
					<div>
						{#each zoom.days as d}
							<div on:click={() => {previewMaterial(d)}} class="cursor-pointer hover:text-blue-700 hover:bg-gray-200 flex items-center mb-1 group py-0.5 rounded">

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
	</div>
</div>