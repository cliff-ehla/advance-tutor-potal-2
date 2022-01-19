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
	console.log('cliff: ', one_on_one)
</script>

<div class="max-w-screen-lg p-4 bg-gray-100">
	<p class="mb-2 font-bold text-xl">My 1-on-1 courses</p>
	<div class="grid grid-cols-3 gap-4">
		{#each one_on_one as course}
			<CoursePreview {course}/>
		{/each}
	</div>

	<p class="mt-8 mb-2 font-bold text-xl">My big class courses</p>
	<div class="grid grid-cols-3 gap-4">
		{#each classroom as course}
			<CoursePreview {course}/>
		{/each}
	</div>
</div>
