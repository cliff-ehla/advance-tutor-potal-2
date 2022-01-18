<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {

		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_zoom_status_in_tutor_group')
		if (!success) return onFail(debug)
		return {
			props: {
				courses: data
			}
		}
	}
</script>

<script>
	import dayjs from "dayjs";
	export let courses

</script>

<div class="p-6">
	<div class="max-w-screen-lg">
		{#each courses as course}
			<div class="p-4 border border-gray-200">
				<a class="hover:text-red-500" href="/students/{course.student_id}/tutor-group/{course.tutor_group_id}">{course.title}</a>
				<p>{dayjs(course.start_date).format('DD MMM')} - {dayjs(course.end_date).format('DD MMM')}</p>
				<p>{course.zoom_completed_cnt} / {course.zoom_total_cnt}</p>
			</div>
		{/each}
	</div>
</div>