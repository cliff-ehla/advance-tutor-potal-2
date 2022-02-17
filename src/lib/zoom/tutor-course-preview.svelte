<script>
	export let course
	import dayjs from "dayjs";
	import Icon from '$lib/ui/icon.svelte'
</script>

<a href="/course/{course.tutor_course_id}" class="block p-4 border hover:shadow-lg transition-shadow rounded bg-white border-blue-300 border border-gray-200">
	<div class="text-blue-500 mb-2 leading-tight">{course.title}</div>
	<div class="flex items-center">
		<Icon name="calendar" className="text-gray-400 w-5"/>
		<p class="ml-1 text-gray-500 text-sm">{dayjs(course.start_date).format('DD MMM')} - {dayjs(course.end_date).format('DD MMM YYYY')}</p>
	</div>
	<p class="mt-2 text-sm">
		<span class="text-gray-500">Upcoming lesson:</span>
		<span class="ml-1">{course.upcoming_zoom_cnt}</span>
	</p>
</a>