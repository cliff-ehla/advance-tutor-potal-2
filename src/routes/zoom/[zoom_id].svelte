<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: page.params.zoom_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				zoom: data
			}
		}
	}
</script>

<script>
	import StudentWidget from '../../components/item/item-pdf-reader/student-widget.svelte'
	import StudentListWidget from '$lib/zoom/student-list-widget.svelte'
	import {session} from '$app/stores'
	import Icon from '$lib/ui/icon.svelte'
	import Countdown from '$lib/live/countdown.svelte'
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)

	export let zoom
	let start_date = dayjs.utc(zoom.start_date).local()
	let end_date = dayjs(start_date).add(zoom.duration, 'minutes')
	start_date = start_date.format('YYYY-MM-DD HH:mm:ss')
	end_date = end_date.format('YYYY-MM-DD HH:mm:ss')
	const items = zoom.days.map(d => ({
		item_id: d.item_ids[0],
		title: d.title
	}))
	const students = zoom.students
	const tutor_group_id = zoom.tutor_group_id
	const is_one_on_one = !zoom.big_classroom_type
	const student_id = is_one_on_one ? students[0].user_id : null
	let selected_item_id = items[0].item_id
	let pdf_json
	let loading_item = true

	import PdfReader from '../../components/item/item-pdf-reader/index.svelte'

	$: {
		if (selected_item_id) getItem()
	}

	const getItem = async () => {
		loading_item = true
		const {data} = await http.post(fetch, '/itemApi/get_by_ids', {
			ids: [selected_item_id]
		})
		if (data) {
			pdf_json = data[0].pdf_json
			loading_item = false
			console.log(pdf_json)
		}
	}
</script>

<div class="h-10 border-b border-gray-300 items-center flex">
	<button on:click={() => {history.back()}} class="w-10 h-10 cc hover:bg-blue-200">
		<Icon name="right" className="transform rotate-180 w-4"/>
	</button>
	{#each items as item}
		<p>{item.title}</p>
	{/each}
</div>

{#if !loading_item}
	<PdfReader pages_info_2={pdf_json}/>
{/if}

<div class="fixed right-8 bottom-0 z-50">
	{#if is_one_on_one}
		<StudentWidget {student_id} {tutor_group_id} teacher_id={$session.user_id}/>
	{:else}
		<StudentListWidget student_list={students}/>
	{/if}
</div>

<div class="fixed bottom-2 left-1/2 transform -translate-x-1/2">
	<Countdown
					{student_id}
					item_id={selected_item_id}
					start_date={start_date}
          end_date={end_date}/>
</div>