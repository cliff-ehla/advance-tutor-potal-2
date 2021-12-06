<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({session, fetch, stuff}) => {
		if (!session.user_info) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		const {success, data, debug} = await http.post(fetch, '/zoomApi/zoom_list_all')
		if (!success) return onFail(debug)
		return {
			stuff: {
				zoom_list: data
			},
			props: {
				zoom_list: data
			}
		}
	}
</script>


<script>
	import Icon from '$lib/ui/icon.svelte'
	import DatePicker from '$lib/ui/date-picker/index.svelte'
	import {page} from '$app/stores'
	import {tutor_group_store} from "../../store";
	const course_list = $tutor_group_store ? tutor_group_store.getAllCourse() : null
	import dayjs from "dayjs";
	export let zoom_list
	$: date_key = `${$page.params.yyyy}-${$page.params.mm}-01`
	const isAllowed = (date) => {
		return zoom_list.some(zoom => {
			return dayjs(zoom.start_date).isSame(dayjs(date), 'day')
		})
	}
	const onDateChange = (e) => {
		console.log(dayjs(e.detail).format('YYYY-MM-DD'))
	}
</script>

<div class="px-4 flex h-12 items-center border-b border-gray-300 sticky top-0 bg-white z-10">

	<div class="flex items-center">
		<a href="list-{dayjs().format('YYYY-MM')}" class="inline-block border border-gray-300 px-2 py-1 rounded">Today</a>
		<div class="flex mx-2">
			<a href="list-{dayjs(date_key).subtract(1,'month').format('YYYY-MM')}" class="block cc w-8 h-8 rounded-full hover:bg-gray-200 transition-colors">
				<Icon name="right" className="w-3 transform rotate-180"/>
			</a>
			<a href="list-{dayjs(date_key).add(1,'month').format('YYYY-MM')}" class="block cc w-8 h-8 rounded-full hover:bg-gray-200 transition-colors">
				<Icon name="right" className="w-3"/>
			</a>
		</div>
		<div class="text-t2 flex items-center">
			<p>{dayjs(date_key).format('MMM YYYY')}</p>
<!--			<p class="mx-2">-</p>-->
<!--			<p>{dayjs(date_key).add(2, 'month').format('MMM YYYY')}</p>-->
		</div>

	</div>
	<div class="ml-auto flex items-center">
		<button>HK</button>
		<button>UK</button>
		<a href="/schedule/list" class:active={$page.path.split('/').pop() === 'list'} class="w-10 h-10 cc rounded">
			<svg viewBox="0 0 36 36" class="fill-current w-5"><path d="M11 14h25v8H11zM0 25h8v7H0zM11 25h25v7H11zM11 4h25v7H11zM0 4h8v7H0zM0 14h8v8H0z"></path></svg>
		</a>
		<a href="/schedule/month" class:active={$page.path.split('/').pop() === 'month'} class="w-10 h-10 cc">
			<Icon name="calendar"/>
		</a>
	</div>
</div>

<div class="flex">
	<div class="top-10 sticky w-64 border-gray-300 border-r overflow-y-scroll flex-shrink-0" style="max-height: calc(100vh - 3em)">
		<div class="h-64 px-3 py-3 border-b border-gray-300">
			<DatePicker {isAllowed} on:input={onDateChange}/>
		</div>
		{#if course_list}
			<p class="uppercase text-xs mb-2 text-black font-bold px-4 pt-4">Courses</p>
			{#each course_list as course}
				<a href="/tutor-group/{course.tutor_group_id}" class="block cursor-pointer py-0.5 px-2.5 hover:bg-gray-200 rounded my-1 mx-2">
					<div class="flex items-center">
						<p class="text-sm relative leading-tight">
							{course.student_name}
							{#if course.unread_message_cnt}
								<span class="w-2 h-2 bg-red-500 rounded-full absolute -left-2 top-0"></span>
							{/if}
						</p>
						<div class="ml-auto flex items-center">
							<Icon name="bell" className="w-3 text-gray-300"/>
							<Icon name="chat" className="w-4 text-gray-300"/>
						</div>
					</div>
					<p class="text-xs text-gray-400">{course.title.split('(')[0]}</p>
				</a>
			{/each}
		{/if}
	</div>

	<div class="max-w-screen-lg">
		<slot/>
	</div>
</div>

<style>
	.active {
		@apply bg-gray-200 text-blue-500;
	}
</style>