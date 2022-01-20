<script>
	import dayjs from "dayjs";
	export let course
	import Icon from '$lib/ui/icon.svelte'

	export let student_id
	$: in_progress = course.zoom_completed_cnt !== course.zoom_total_cnt
	$: completed = course.zoom_completed_cnt === course.zoom_total_cnt
</script>

<a href="/students/{student_id}/tutor-group/{course.tutor_group_id}" class="block p-4 border hover:shadow-lg transition-shadow rounded {in_progress ? 'bg-white border-blue-300' : 'bg-blue-50 border-gray-200'} border border-gray-200">
	<div class="{completed ? 'text-gray-500' : 'text-blue-500'} mb-2 leading-tight">{course.title.split('(')[0]}</div>
	<div class="lg:flex items-center">
		<div class="flex items-center mr-2">
			<Icon name="calendar" className="text-gray-400 w-5 flex-shrink-0"/>
			<p class="ml-1 text-gray-500 text-sm leading-tight">{dayjs(course.start_date).format('DD MMM')} - {dayjs(course.end_date).format('DD MMM YYYY')}</p>
		</div>
		{#if completed}
			<div class="text-xs bg-gray-400 rounded px-2 text-white inline-block">
				Completed
			</div>
		{:else}
			<div class="text-xs bg-yellow-500 rounded px-2 text-white">
				<p>{course.zoom_completed_cnt} of {course.zoom_total_cnt}</p>
			</div>
		{/if}
	</div>
</a>