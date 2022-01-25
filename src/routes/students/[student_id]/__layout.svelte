<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_fans_detail_overview', {
			student_id: page.params.student_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				detail: data
			},
			stuff: {
				overview: data
			}
		}
	}
</script>

<script>
	import {page, session} from '$app/stores'
	import {capitalize} from "$lib/helper/capitalize.js";
	import StudentNoteReadOnly from '$lib/student/student-note-readonly.svelte'
	import MessageWidget from '$lib/message/message-widget.svelte'
	import dayjs from "dayjs";
	import Icon from '$lib/ui/icon.svelte'
	export let detail
	$: student_id = $page.params.student_id
	$: tutor_group_id = $page.params.tutor_group_id
	$: slug = $page.path.split('/').pop()
	$: is_overview = $page.path.split('/').length === 3
</script>

<div class="bg-gray-50">
<div class="max-w-screen-lg mx-auto text-gray-400">
	<div class="flex p-4 text-sm breadcrumb">
		<a href="/students">Students</a>
		<span class="mx-2"> > </span>
		<a href="/students/{student_id}">{detail.nickname}</a>
		{#if is_overview}
		{:else}
			{#if tutor_group_id}
				<span class="mx-2"> > </span>
				<span>{tutor_group_id}</span>
			{:else}
				<span class="mx-2"> > </span>
				{slug}
			{/if}
		{/if}
	</div>
</div>

{#if is_overview}
	<div class="bg-banner p-4 -mt-12 pt-12">
		<div class="max-w-screen-lg mx-auto">
			<div class="flex my-8">
				<div class="w-72">
					<div class="mx-auto w-28 h-28 rounded-full border-2 border-gray-300 relative shadow bg-white">
						<img src="/student-{detail.gender}-icon.png" alt="gender" class="rounded-full">
						<div class="absolute -bottom-2 -right-4 ml-2 w-10 h-10 bg-blue-500 rounded-full cc text-white">{capitalize(detail.level)}</div>
					</div>
				</div>
				<div class="ml-4">
					<p style="font-size: 2em" class="font-light text-xl mb-4">{detail.nickname}</p>
					<div class="grid grid-cols-3 gap-4">
						<div>
							<a href="/students/{student_id}/upcoming-lesson"
							   class="text-gray-500 flex items-end hover:text-blue-500 border border-transparent hover:border-blue-500 hover:bg-white transition-colors p-2 rounded hover:shadow">
								<p class="num">{detail.upcoming_zoom_cnt}</p>
								<p class="text-xs ml-1 mb-0.5 leading-none">Upcoming <br/>lessons</p>
							</a>
						</div>
						<div>
							<a href="/students/{student_id}/past-lesson"
							   class="text-gray-500 flex items-end hover:text-blue-500 hover:bg-white transition-colors p-2 rounded hover:shadow">
								<p class="num">{detail.completed_zoom_cnt}</p>
								<p class="text-xs ml-1 mb-0.5 text-gray-500 leading-none">Completed <br/>lessons</p>
							</a>
						</div>
						<a class="leading-none mt-1.5 p-2">
							<p class="text-xs text-gray-500 leading-none mb-1">Last lessons</p>
							<p>{dayjs().diff(dayjs(detail.last_zoom_lesson_date), 'day')} <span class="text-gray-500">days ago</span></p>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="p-4 py-8 bg-gray-100">
		<slot/>
	</div>
{:else}
	<div class="relative container pb-8">
		<div class="w-64 absolute left-0 p-4 mt-4">
			<div class="mx-auto w-20 h-20 rounded-full border-2 border-gray-300 relative shadow bg-white">
				<img src="/student-{detail.gender}-icon.png" alt="gender" class="rounded-full">
				<div class="absolute -bottom-2 -right-4 ml-2 w-10 h-10 bg-blue-500 rounded-full cc text-white">{capitalize(detail.level)}</div>
			</div>
			<p class="font-light text-xl mt-4 text-center">{detail.nickname}</p>
			<div class="section-box mt-4">
				<div class="flex items-center mb-4">
					<Icon name="report" className="w-6 text-gray-400"/>
					<p class="section-title ml-1">Notes</p>
				</div>
				<StudentNoteReadOnly {student_id}/>
			</div>
			{#if tutor_group_id}
				<div class="bg-white border border-gray-300 rounded mt-2">
					<div class="flex items-center p-4">
						<Icon name="chat" className="w-6 text-gray-300"/>
						<p class="section-title ml-1">Conversation</p>
					</div>
					<MessageWidget crazy_fetch={false} {tutor_group_id} {student_id} height="calc(200px)"/>
				</div>
			{/if}
		</div>
		<div class="ml-64">
			<slot/>
		</div>
	</div>
{/if}
</div>

<style>
	.num {
		font-size: 2.5em;
		@apply leading-none font-light;
	}
	.bg-banner {
		background-image: url('/student-overiew-bg-1.png');
		background-size: 38%;
	}
	.breadcrumb a {
		@apply text-blue-500;
	}
</style>