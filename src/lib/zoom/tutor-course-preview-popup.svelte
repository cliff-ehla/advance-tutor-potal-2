<script>
	import TutorCourseTimeline from './tutor-course-timeline.svelte'
	export let existing_classroom
</script>

<div class="dropdown">
	{#if existing_classroom}
		<TutorCourseTimeline {existing_classroom}/>
	{/if}
</div>