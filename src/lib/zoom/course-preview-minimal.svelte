<script>
	import dayjs from "dayjs";
	export let course
	import Icon from '$lib/ui/icon.svelte'

	export let student_id
	$: completed = course.upcoming_zoom_cnt === 0
	$: upcoming = course.completed_zoom_cnt === 0
	$: in_progress = !(completed || upcoming)
	$: total_zoom_cnt = Number(course.completed_zoom_cnt) + Number(course.upcoming_zoom_cnt)
</script>

<a href="/students/{student_id}/tutor-group/{course.tutor_group_id}" class="block p-4 border hover:border-blue-500 hover:shadow-lg transition-shadow rounded {in_progress ? 'bg-white border-blue-300' : 'bg-gray-100 border-gray-200'} border border-gray-200">
	<div class="{completed ? 'text-gray-500' : 'text-blue-500'} mb-2 leading-tight">{course.title.split('(')[0]}</div>
	<div class="lg:flex items-center">
		<div class="flex items-center mr-2">
			<Icon name="calendar" className="text-gray-400 w-5 flex-shrink-0"/>
			<p class="ml-1 text-gray-500 text-sm leading-tight">{dayjs.utc(course.start_date).local().format('DD MMM')} - {dayjs.utc(course.end_date).local().format('DD MMM YYYY')}</p>
		</div>
		<div class="{completed ? 'bg-gray-400' : upcoming ? 'bg-green-500' : 'bg-yellow-500'} text-xs  rounded px-2 text-white inline-block">
			{course.completed_zoom_cnt} of {total_zoom_cnt}
		</div>
	</div>
</a>