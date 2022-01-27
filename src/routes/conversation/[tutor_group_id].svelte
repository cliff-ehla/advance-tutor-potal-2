<script>
	import {page} from "$app/stores";
	import {course_list_store} from "$lib/store/course_list_store.js";
	import MessageWidget from '$lib/message/message-widget.svelte'
	import Icon from '$lib/ui/icon.svelte'
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {capitalize} from "$lib/helper/capitalize.js";
	import {onMount} from "svelte";

	onMount(() => {
		if (!course) course_list_store.cacheFirst(fetch)
	})
	dayjs.extend(utc)
	$: tutor_group_id = $page.params.tutor_group_id
	$: course = $course_list_store ? course_list_store.getTutorGroup(tutor_group_id) : undefined
	$: student = $course_list_store ? course_list_store.getStudent(tutor_group_id) : undefined
	$: student_id = student && student.id
</script>

{#if course}
	<a href="/students/{student_id}" class="group h-20 flex items-center border-b border-gray-200 px-4">
		<div class="w-full flex items-center">
			<div class="w-12 h-12 rounded-full border border-gray-400 relative shadow flex-shrink-0">
				<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full">
				<div class="absolute shadow font-bold border border-white -bottom-2 -right-2 ml-2 w-7 h-7 bg-blue-500 rounded-full text-xs cc text-white">{capitalize(student.level)}</div>
			</div>
			<div class="ml-4">
				<p style="font-size: 1.8em" class="group-hover:text-blue-500 mt-1 font-light text-xl text-gray-700 leading-none">{student.nickname}</p>
			</div>
			<div class="ml-auto flex-shrink-0">
				<Icon name="right" className="w-4 text-blue-100 group-hover:text-blue-500"/>
			</div>
		</div>
	</a>
	<a href="/students/{student_id}/tutor-group/{tutor_group_id}" class="h-8 flex items-center px-4 border-b border-gray-200 bg-gray-50 group hover:bg-blue-50">
		<p class="group-hover:text-blue-600 text leading-none text-blue-500">{course.title.split('(')[0]}</p>
		<span class="ml-auto flex-shrink-0">
			<Icon name="right" className="w-4 text-blue-100 group-hover:text-blue-500"/>
		</span>
	</a>
{/if}
{#if student_id && tutor_group_id}
	<div class="bg-gray-50">
		<div class="pt-4 max-w-screen-md mx-auto bg-white">
			<MessageWidget crazy_fetch={false} {tutor_group_id} {student_id} height="calc(100vh - 15em)"/>
		</div>
	</div>
{/if}