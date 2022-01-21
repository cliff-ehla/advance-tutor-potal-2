<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_fans')
		if (!success) return onFail(debug)
		return {
			props: {
				student_list: data
			}
		}
	}
</script>

<script>
	export let student_list
	import dayjs from "dayjs";
	import {capitalize} from "$lib/helper/capitalize.js";
	import Icon from '$lib/ui/icon.svelte'
	import Selection from '$lib/ui/selection.svelte'
	$: sorted_student_list = student_list.sort((a,b) => {
		if (a[sort_by] === b[sort_by]) return 0
		if (a[sort_by] > b[sort_by]) return -1
		if (a[sort_by] < b[sort_by]) return 1
	})
	const options = [
		{
			label: 'Upcoming lessons',
			value: 'upcoming_zoom_cnt'
		},
		{
			label: 'Completed lessons',
			value: 'completed_zoom_cnt'
		},
		{
			label: 'Last lesson date',
			value: 'last_lesson_date'
		}
	]

	let sort_by = 'upcoming_zoom_cnt'
</script>

<div class="bg-gray-100">
	<div class="max-w-screen-lg mx-auto">
		<div class="flex items-center justify-between py-4">
			<h1 class="font-light text-gray-500" style="font-size: 2em;">My Students</h1>
			<div class="ml-auto flex items-center">
				<Selection {options}
				           icon="sort"
				           label="Sort by"
				           selected_value={sort_by} on:input={e => sort_by = e.detail}/>
			</div>
		</div>
		<div class="grid grid-cols-3 gap-4">
			{#each sorted_student_list as s}
				<a href="/students/{s.user_id}" class="p-4 flex items-center bg-white rounded border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-shadow">
					<div class="w-20 h-20 rounded-full border-2 border-gray-300 relative shadow flex-shrink-0">
						<img src="/student-{s.gender}-icon.png" alt="gender" class="rounded-full">
						<div class="absolute -bottom-2 -right-4 ml-2 w-10 h-10 bg-blue-500 rounded-full cc text-white">{capitalize(s.level)}</div>
					</div>
					<div class="ml-6">
						<p class="font-bold">{s.nickname}</p>
						<p class="text-xs text-gray-500 mb-1">Seen <b>{dayjs().diff(dayjs(s.last_lesson_date),'day')}</b> days before</p>
						{#if s.upcoming_zoom_cnt}
							<div class="inline-flex items-center text-xs">
								<div class="w-2 h-2 rounded-full bg-red-500 mx-0.5"></div>
								<div class="ml-1"><b>{s.upcoming_zoom_cnt}</b> <span class="text-gray-500">Upcoming Lessons</span></div>
							</div>
						{:else}
							<div class="inline-flex items-center text-xs">
								<div class="w-2 h-2 rounded-full bg-gray-300 mx-0.5"></div>
								<div class="ml-1"><span class="text-gray-400">No upcoming lessons</span></div>
							</div>
						{/if}
						<div class="inline-flex items-center text-xs">
							<Icon name="stopwatch" className="w-3"/>
							<div class="ml-1"><b>{s.completed_zoom_cnt}</b> <span class="text-gray-500">Completed Lessons</span></div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>