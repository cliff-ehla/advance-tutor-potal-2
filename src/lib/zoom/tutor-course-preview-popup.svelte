<script>
	import TutorCourseTimeline from './tutor-course-timeline.svelte'
	import Spinner from '$lib/ui/spinner.svelte'
	export let existing_classroom
</script>

<div class="dropdown">
	{#if existing_classroom}
		<TutorCourseTimeline {existing_classroom}/>
	{:else}
		<Spinner/>
	{/if}
</div>