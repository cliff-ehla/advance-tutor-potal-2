<script>
	import {http} from "$lib/http.js";

	export let course
	import {rc_level_to_label} from "$lib/store/rc-level-to-label.js";
	import TutorCourseTimeline from '$lib/zoom/tutor-course-timeline.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Spinner from '$lib/ui/spinner.svelte'
	import Icon from '$lib/ui/icon.svelte'
	let existing_classroom

	const onHover = async () => {
		if (existing_classroom) return
		const res = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id: course.tutor_course_id
		})
		if (res.success) {
			let data = res.data
			existing_classroom = data.existing_classroom
		}
	}
</script>

<a href="/course/{course.tutor_course_id}" class="block p-4 border hover:shadow-lg transition-shadow rounded bg-white border-blue-300 border border-gray-200">
	<div class="flex w-full mt-1">
		<p class="flex-1 text-purple-800 text-sm leading-tight">{course.sub_cat}</p>
		<Dropdown placement="right" activator_style="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 ml-1 block">
			<button slot="activator" class="w-6 h-6 cc" on:mouseenter={onHover}>
				<Icon className="w-3 text-gray-500" name="info"/>
			</button>
			<div class="dropdown overflow-y-scroll" style="max-height: 400px">
				{#if existing_classroom}
					<TutorCourseTimeline {existing_classroom}/>
				{:else}
					<Spinner/>
				{/if}
			</div>
		</Dropdown>
	</div>
	<p class="text-xs bg-purple-400 rounded-sm font-bold text-white px-2 py-0.5 leading-tight inline-block">
		#{course.description_code_short_id}
	</p>
	<p class="text-xs bg-purple-50 rounded-sm text-purple-500 px-2 py-0.5 leading-tight inline-block">
		{rc_level_to_label[course.rc_level] || course.rc_level}
	</p>
	<div class="text-gray-500 my-2 text-xs leading-tight">{course.title}</div>
	<p class="mt-2 text-sm">
		<span class="text-gray-500">Upcoming lesson:</span>
		<span class="ml-1">{course.upcoming_zoom_cnt}</span>
	</p>
</a>