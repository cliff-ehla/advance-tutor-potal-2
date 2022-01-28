<script context="module">
	import {onFail} from "$lib/http";
	import {course_list_store} from "$lib/store/course_list_store.js";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await course_list_store.cacheFirst(fetch)
		if (!success) return onFail(debug)
		return true
	}
</script>

<script>
	import CoursePreview from '$lib/zoom/course-preview.svelte'
	import Icon from '$lib/ui/icon.svelte'
</script>

<div class="bg-gray-100">
	<div class="container pb-8">
		<div class="flex items-center py-4">
			<Icon name="one-on-one" className="w-12 text-black-500"/>
			<p class="page-title ml-3">My 1-on-1 classes</p>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each $course_list_store.one_on_one as course}
				<CoursePreview {course}/>
			{/each}
		</div>
	</div>
</div>