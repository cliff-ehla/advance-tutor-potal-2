<script>
	import {course_store} from "$lib/store/course.js";
	import {onMount} from "svelte";
	import dayjs from "dayjs";
	import CourseTimeLine from '$lib/zoom/course-timeline.svelte'
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


<div class="bg-white p-4 shadow-lg rounded text-xs border border-gray-300 overflow-scroll" style="max-height: 500px">
	<div class="mb-2">
		{completed_count} / {total_count} completed
	</div>
	<div class="overflow-auto" style="max-height: 1000px;">
		{#if zoom_list}
			<CourseTimeLine {zoom_list}/>
		{/if}
	</div>
</div>
