<script context="module">
	export function load ({page, stuff}) {
		return {
			props: {
				overview: stuff.overview
			}
		}
	}
</script>

<script>
	import ZoomPreviewMinimal from '$lib/zoom/zoom-preview-minimal.svelte'
	import CoursePreviewMinimal from '$lib/zoom/course-preview-minimal.svelte'
	import {student_store} from "$lib/store/student.js";
	import NoteWidget from '../../../components/message/note-widget.svelte'
	import {session} from "$app/stores";
	import {page} from "$app/stores";
	import Icon from '$lib/ui/icon.svelte'

	export let overview
	console.log(overview)

	$: student_id = $page.params.student_id
	$: completed_zoom_list = overview.completed_zoom_list
	$: upcoming_zoom_list = overview.upcoming_zoom_list
	$: one_on_one_course = overview.one_on_one_course
</script>

<div class="flex max-w-screen-lg mx-auto">
	<div class="w-72 flex-shrink-0 bg-white border border-gray-300 rounded">
		<div class="p-4 border-b border-gray-300">
			<div class="flex items-center">
				<div class="w-2 h-2 mx-1 rounded-full {upcoming_zoom_list.length ? 'bg-red-500' : 'bg-gray-400'}"></div>
				<p class="ml-2 text-sm uppercase text-gray-500">Upcoming lessons</p>
			</div>
			{#if upcoming_zoom_list.length}
				{#each upcoming_zoom_list as zoom}
					<ZoomPreviewMinimal {zoom}/>
				{/each}
			{:else}
				<p class="text-gray-400 px-6 my-2 text-xs">No upcoming lessons</p>
			{/if}
		</div>

		<div class="p-4">
			<div class="flex items-center">
				<Icon name="stopwatch" className="w-4 text-gray-500"/>
				<p class="ml-2 text-sm uppercase text-gray-500">Recent lessons</p>
			</div>
			{#if completed_zoom_list.length}
				{#each completed_zoom_list as zoom}
					<div class="my-4">
						<ZoomPreviewMinimal {zoom}/>
					</div>
				{/each}
			{:else}
				<p class="text-gray-400">No history</p>
			{/if}
		</div>
	</div>

	<div class="flex-1 ml-4 p-4 bg-white border border-gray-300">
		<p class="mb-4 text uppercase text-gray-500">All courses</p>
		<div class="grid grid-cols-2 gap-4">
			{#each one_on_one_course as course}
				<CoursePreviewMinimal {student_id} {course}/>
			{/each}
		</div>
	</div>
</div>