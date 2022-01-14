<script context="module">
	import {zoom_store} from "$lib/store/zoom.js";

	export const load = async ({session, page, fetch, stuff}) => {
		if (page.query.get('reload')) {}
		if (!session.user_info) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		await zoom_store.cacheFirst(fetch)
		return true
	}
</script>


<script>
	import Icon from '$lib/ui/icon.svelte'
	import {page} from '$app/stores'
	import {tutor_group_store} from "../../store";
	import dayjs from "dayjs";
	import {tooltip} from "$lib/aciton/tooltip.js";

	const course_list = $tutor_group_store ? tutor_group_store.getAllCourse() : null
	$: slug = $page.path.split('/').pop()
	let zoom_list = $zoom_store.list
	$: date_key = `${$page.params.yyyy}-${$page.params.mm}-${$page.params.dd}`
	$: start_of_week = dayjs(date_key).startOf('week')
	$: end_of_week = dayjs(date_key).endOf('week')
</script>

<div class="px-4 flex h-12 items-center border-b border-gray-300 sticky top-0 bg-white z-10">

	<div class="flex items-center">
		<a href="/schedule/{dayjs().format('YYYY-MM-DD')}/{slug}" class="calendar-button">Today</a>
		<div class="flex mx-2">
			<a href="/schedule/{dayjs(date_key).subtract(1,slug).format('YYYY-MM-DD')}/{slug}" class="block cc w-8 h-8 rounded-full hover:bg-gray-200 transition-colors">
				<Icon name="right" className="w-4 transform rotate-180"/>
			</a>
			<a href="/schedule/{dayjs(date_key).add(1,slug).format('YYYY-MM-DD')}/{slug}" class="block cc w-8 h-8 rounded-full hover:bg-gray-200 transition-colors">
				<Icon name="right" className="w-4"/>
			</a>
		</div>
		<div class="text-t2 flex items-center">
			{#if slug === 'week'}
				<p>{start_of_week.format('DD MMM')} - {end_of_week.format('DD MMM YYYY')}</p>
			{:else if slug === 'month' || slug === 'list'}
				<p>{dayjs(date_key).format('MMM YYYY')}</p>
			{/if}
		</div>
	</div>
	<div class="ml-auto flex items-center">
		{#each $zoom_store.time_zone_options as option}
			<button use:tooltip={`Change time zone to ${option.label}`} on:click={zoom_store.setTimeZoom(option.tz)} class="calendar-button ml-1" class:active={option.active}>{option.label}</button>
		{/each}
		<div class="ml-4"></div>
		<a use:tooltip={'Month view'} href="/schedule/{dayjs().format('YYYY-MM-DD')}/month" class:active={slug === 'month'} class="calendar-button ml-1">
			<Icon name="month"/>
		</a>
		<a use:tooltip={'Week view'} href="/schedule/{dayjs().format('YYYY-MM-DD')}/week" class:active={slug === 'week'} class="calendar-button ml-1">
			<Icon name="week"/>
		</a>
		<a use:tooltip={'Schedule view'} href="/schedule/{dayjs().format('YYYY-MM-DD')}/list" class:active={slug  === 'list'} class="calendar-button ml-1">
			<svg viewBox="0 0 36 36" class="fill-current w-5"><path d="M11 14h25v8H11zM0 25h8v7H0zM11 25h25v7H11zM11 4h25v7H11zM0 4h8v7H0zM0 14h8v8H0z"></path></svg>
		</a>
	</div>
</div>

<div class="flex">
	<div class="top-10 sticky w-56 border-gray-300 border-r overflow-y-scroll flex-shrink-0" style="max-height: calc(100vh - 3em)">
<!--		<div class="h-64 px-3 py-3 border-b border-gray-300">-->
<!--			<DatePicker on:input={onDateChange}/>-->
<!--		</div>-->
		{#if course_list}
			<p class="uppercase text-xs mb-2 text-black font-bold px-4 pt-4">1-on-1 Courses</p>
			{#each course_list as course}
				<a href="/students/{course.student_id}/tutor-group/{course.tutor_group_id}" class="block cursor-pointer py-0.5 px-2.5 hover:bg-gray-200 rounded my-1 mx-2">
					<div class="flex items-center">
						<p class="text-sm relative leading-tight">
							{course.student_name}
							{#if course.unread_message_cnt}
								<span class="w-2 h-2 bg-red-500 rounded-full absolute -left-2 top-0"></span>
							{/if}
						</p>
						<div class="ml-auto flex items-center text-xs">

<!--							<Icon name="bell" className="w-3 text-gray-300"/>-->
<!--							<Icon name="chat" className="w-4 text-gray-300"/>-->
						</div>
					</div>
					<div class="text-xs text-gray-400 flex">
						<p class="text-xs text-gray-400 leading-tight">{course.title.split('(')[0]}</p>
						<p class="ml-auto">{course.completion_cnt}/{course.total_lesson_cnt}</p>
					</div>
				</a>
			{/each}
		{/if}
	</div>

	<div class="w-full">
		<slot/>
	</div>
</div>

<style>
	.active {
		@apply bg-gray-200 text-blue-500;
	}
</style>