<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id: page.params.tutor_course_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				course_detail: data
			}
		}
	}
</script>

<script>
	export let course_detail
	import TutorCourseTimeline from '$lib/zoom/tutor-course-timeline.svelte'

	$: existing_classroom = course_detail.existing_classroom
</script>

<div class="container py-4 mx-auto">
	<h1 class="page-title mb-4">{course_detail.title}</h1>
	<TutorCourseTimeline {existing_classroom}/>
</div>