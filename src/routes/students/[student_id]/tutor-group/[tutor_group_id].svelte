<script context="module">
	import {course_store} from "$lib/store/course.js";

	export const load = async ({page, fetch}) => {
		if (page.query.get('reload')) {}
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

<div class="p-4 pt-0">
	<h1 style="font-size: 1.5em" class="font-light mb-4">Speaking and reading class</h1>
	<div class="section-box">
		{#if zoom_list}
			<CourseTimeLine {zoom_list}/>
		{/if}
	</div>
	<!--			<MessageWidget {tutor_group_id} {student_id} height="calc(100vh - 200px)"/>-->
</div>