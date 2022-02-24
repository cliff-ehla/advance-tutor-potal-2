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
	import TutorCoursePreview from '$lib/zoom/tutor-course-preview.svelte'
	import StudentNoteReadOnly from '$lib/student/student-note-readonly.svelte'
	import {page} from "$app/stores";
	import Icon from '$lib/ui/icon.svelte'

	export let overview

	$: student_id = $page.params.student_id
	$: completed_zoom_list = overview.completed_zoom_list
	$: upcoming_zoom_list = overview.upcoming_zoom_list
	$: one_on_one_course = overview.one_on_one_course
	$: tutor_course = overview.tutor_course
	$: completed_zoom_cnt = overview.completed_zoom_cnt
	$: upcoming_zoom_cnt = overview.upcoming_zoom_cnt
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
					<div class="my-4">
						<ZoomPreviewMinimal {zoom}/>
					</div>
				{/each}
				<a href="/students/{student_id}/upcoming-lesson" class="text-sm text-blue-500 text-center block bg-gray-100 py-1 border border-gray-200 hover:border-blue-500">See all upcoming lessons</a>
			{:else}
				<p class="text-gray-400 px-6 my-2 text-xs">No upcoming lessons</p>
			{/if}
		</div>

		<div class="p-4">
			<div class="flex items-center">
				<Icon name="stopwatch" className="w-4 text-gray-500"/>
				<p class="ml-2 text-sm uppercase text-gray-500">Learning history</p>
			</div>
			{#if completed_zoom_list.length}
				{#each completed_zoom_list as zoom}
					<div class="my-4">
						<ZoomPreviewMinimal {zoom}/>
					</div>
				{/each}
				<a href="/students/{student_id}/historical-lessons" class="text-sm text-blue-500 text-center block bg-gray-100 py-1 border border-gray-200 hover:border-blue-500">See all learning history</a>
			{:else}
				<p class="text-gray-400">No history</p>
			{/if}
		</div>
	</div>

	<div class="flex-1 ml-4">
		<div class="section-box">
			<div class="flex mb-4 items-center">
				<Icon name="one-on-one" className="w-8"/>
				<p class="ml-2 text uppercase text-gray-500">1-on-1 courses</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#if one_on_one_course.length}
					{#each one_on_one_course as course}
						<CoursePreviewMinimal {student_id} {course}/>
					{/each}
				{:else}
					<p class="note">No courses</p>
				{/if}
			</div>
		</div>

		<div class="section-box mt-4">
			<div class="flex mb-4 items-center">
				<Icon name="one-on-one" className="w-8"/>
				<p class="ml-2 text uppercase text-gray-500">Group courses</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#if tutor_course.length}
					{#each tutor_course as course}
						<TutorCoursePreview {course}/>
					{/each}
				{:else}
					<p class="note">No courses</p>
				{/if}
			</div>
		</div>

		<div class="section-box mt-4">
			<div class="flex mb-4 items-center">
				<Icon name="report" className="w-8 text-gray-400"/>
				<p class="ml-2 text uppercase text-gray-500">Notes</p>
				<a href="/students/{student_id}/notes" class="ml-auto icon-button">
					<Icon name="edit" className="w-5 text-blue-500"/>
				</a>
			</div>
			<StudentNoteReadOnly readonly {student_id}/>
		</div>
	</div>
</div>