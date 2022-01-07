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
	import {page} from "$app/stores";
	import {tutor_group_store} from "../../../../store/index.js";
	import MessageWidget from '$lib/message/message-widget.svelte'
	import CourseTimeLine from '$lib/zoom/course-timeline.svelte'

	$: tutor_group_id = $page.params.tutor_group_id
	$: student_id = $page.params.student_id
	$: tutor_group = $tutor_group_store.tutor_group[tutor_group_id]
	$: zoom_list = $course_store[tutor_group_id]
</script>

<h1 class="font-bold mb-4">{tutor_group && tutor_group.title.split('(')[0]}</h1>
<div class="flex">
	<div class="flex-1 bg-white p-4 border border-gray-300">
		{#if zoom_list}
			<CourseTimeLine {zoom_list}/>
		{/if}
	</div>
	<div class="ml-4 bg-white border border-gray-300 w-48">
		<MessageWidget {tutor_group_id} {student_id} height="calc(100vh - 200px)"/>
	</div>
</div>