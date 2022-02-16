<script>
	export let tutor_course_id
	import {onMount} from "svelte";
	import {http} from "$lib/http.js";
	import TutorCourseTimeline from './tutor-course-timeline.svelte'

	let existing_classroom

	onMount(async () => {
		const {data, success, debug} = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id
		})
		if (success) existing_classroom = data.existing_classroom
	})
</script>

<div class="dropdown">
	{#if existing_classroom}
		<TutorCourseTimeline {existing_classroom}/>
	{/if}
</div>