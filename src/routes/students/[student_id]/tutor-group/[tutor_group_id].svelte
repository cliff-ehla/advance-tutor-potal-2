<script context="module">
	import {course_store} from "$lib/store/course.js";

	export const load = async ({page, fetch}) => {
		if (page.query.get('reload')) {}
		await course_store.fetchZoomList(fetch, {
			tutor_group_id: page.params.tutor_group_id
		})
		return true
	}
</script>

<script>
	import {page} from "$app/stores";
	import {tutor_group_store} from "../../../../store/index.js";
	import CourseTimeLine from '$lib/zoom/course-timeline.svelte'
	import MessageWidget from '$lib/message/message-widget.svelte'
	import Icon from '$lib/ui/icon.svelte'
	import dayjs from "dayjs";

	$: tutor_group_id = $page.params.tutor_group_id
	$: student_id = $page.params.student_id
	$: tutor_group = $tutor_group_store.tutor_group[tutor_group_id]
	$: zoom_list = $course_store[tutor_group_id]
	$: tutor_group_title = zoom_list[0].tutor_group_title
	$: course_start_date = zoom_list[0].start_date
	$: course_end_date = zoom_list[zoom_list.length - 1].start_date
	$: course_completed = dayjs().isAfter(dayjs(course_end_date))
	$: course_not_started = dayjs().isBefore(dayjs(course_start_date))
</script>

<div class="p-4 pt-0">
	<div class="mb-4">
		<h1 style="font-size: 1.5em" class="font-light">{tutor_group_title.split('(')[0]}</h1>
		<div class="flex items-center mt-1">
			<Icon name="calendar" className="w-6 text-gray-400"/>
			<p class="ml-2 text-gray-500">{dayjs(course_start_date).format('DD MMM')} - {dayjs(course_end_date).format('DD MMM')}</p>
			<div class="ml-4">
				{#if course_completed}
					<div class="text-sm px-4 py-1 bg-gray-200 rounded-full inline-flex items-center">
						<p class="text-gray-500">Course completed</p>
					</div>
				{:else if course_not_started}
					<div class="text-sm px-4 py-1 bg-green-100 rounded-full inline-flex items-center">
						<div class="w-2 h-2 rounded-full bg-green-500"></div>
						<p class="ml-2 text-green-600">To start</p>
					</div>
				{:else}
					<div class="text-sm px-4 py-1 bg-yellow-100 rounded-full inline-flex items-center">
						<div class="w-2 h-2 rounded-full bg-yellow-500"></div>
						<p class="ml-2 text-yellow-600">In progress</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="section-box">
		{#if zoom_list}
			<CourseTimeLine {zoom_list}/>
		{/if}
	</div>
	<div class="fixed bottom-0 right-4 w-72 bg-white border border-gray-300 rounded mt-2">
		<div class="flex items-center p-4 border-b border-gray-300">
			<Icon name="chat" className="w-6 text-gray-300"/>
			<p class="section-title ml-1">Conversation</p>
			<a href="/course/conversation/{tutor_group_id}" class="ml-auto">
				<Icon name="expand" className="w-4 text-gray-300"/>
			</a>
		</div>
		<div class="px-4 pb-1">
			<MessageWidget crazy_fetch={false} {tutor_group_id} {student_id} height="calc(200px)"/>
		</div>
	</div>
</div>