<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {

		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_zoom_status_in_tutor_group')
		if (!success) return onFail(debug)
		return {
			props: {
				classroom: data.classroom,
				one_on_one: data.one_on_one
			}
		}
	}
</script>

<script>
	export let one_on_one
	export let classroom
	import CoursePreview from '$lib/zoom/course-preview.svelte'
</script>

<div class="bg-gray-100">
	<div class="container pb-8">
		<p style="font-size: 2em" class="font-light text-gray-500 py-4">My 1-on-1 courses</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each one_on_one as course}
				<CoursePreview {course}/>
			{/each}
		</div>

<!--		<p class="mt-8 mb-2 font-bold text-xl">My big class courses</p>-->
<!--		<div class="grid grid-cols-3 gap-4">-->
<!--			{#each classroom as course}-->
<!--				<CoursePreview {course}/>-->
<!--			{/each}-->
<!--		</div>-->
	</div>
</div>