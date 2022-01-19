<script>
	import dayjs from "dayjs";
	export let course
	import StudentLabel from '$lib/student/student-label.svelte'
	import Icon from '$lib/ui/icon.svelte'

	$: in_progress = course.zoom_completed_cnt !== course.zoom_total_cnt
	$: completed = course.zoom_completed_cnt === course.zoom_total_cnt
	$: student = course.students[0] || {}
</script>

<a href="/students/{student.id}/tutor-group/{course.id}" class="block p-4 border hover:shadow-lg transition-shadow rounded {in_progress ? 'bg-white border-blue-300' : 'bg-blue-50 border-gray-200'} border border-gray-200">
	<div class="{completed ? 'text-gray-500' : 'text-blue-500'} mb-2 leading-tight">{course.title.split('(')[0]}</div>
	<div class="flex items-center">
		<Icon name="calendar" className="text-gray-400 w-5"/>
		<p class="ml-1 text-gray-500 text-sm">{dayjs(course.start_date).format('DD MMM')} - {dayjs(course.end_date).format('DD MMM YYYY')}</p>
		{#if completed}
			<div class="text-xs bg-gray-400 rounded px-2 text-white ml-2">
				Completed
			</div>
		{:else}
			<div class="text-xs bg-yellow-500 rounded px-2 text-white ml-4">
				<p>{course.zoom_completed_cnt} of {course.zoom_total_cnt}</p>
			</div>
		{/if}
	</div>
	<div class="mt-4">
		{#each course.students as s}
			<StudentLabel student={s}/>
		{/each}
	</div>
</a>