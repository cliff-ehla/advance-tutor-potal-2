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
	import {onMount} from "svelte";
	import {page} from "$app/stores";
	import {slack} from "$lib/helper/slack.js";
	import {tooltip} from "$lib/aciton/tooltip.js";
	dayjs.extend(utc)

	onMount(() => {
		checkEnterClassTime()
	})

	const checkEnterClassTime = () => {
		const diff = dayjs(start_date).diff(dayjs(), 'minute')
		const is_late = diff < 0
		if (is_late)
			slack.send(`I am late for ${diff} minutes for zoom class - ${$page.params.zoom_id}`)
		else
			slack.send(`I arrive on time (${diff} before time start) for the zoom class - ${$page.params.zoom_id}`)
	}

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
	let youtube_links
	let loading_item = true

	import PdfReader from '$lib/pdf-reader/index.svelte'

	$: {
		if (selected_item_id) getItem()
	}

	const getItem = async () => {
		loading_item = true
		const {data, success} = await http.post(fetch, '/itemApi/get_by_ids', {
			ids: [selected_item_id]
		})
		if (success) {
			let ppt_link = data[0].ppt_link
			if (ppt_link) {
				open(ppt_link, 'preview', 'popup')
			} else {
				pdf_json = data[0].pdf_json
				youtube_links = data[0].youtube_link
				loading_item = false
			}
		}
	}
</script>

<div class="h-10 border-b border-gray-300 items-center flex">
	<button use:tooltip={'Back'} on:click={() => {history.back()}}
	        class="icon-button text-gray-500">
		<Icon name="right" className="transform rotate-180 w-4"/>
	</button>
	{#each items as item}
		<button class:text-blue-500={item.item_id === selected_item_id}
		   on:click={() => {selected_item_id = item.item_id}}
		   class="px-2 py-1 cursor-pointer rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 mx-1">
			{item.title}
		</button>
	{/each}
</div>

{#if !loading_item}
	<PdfReader {youtube_links} pages_info_2={pdf_json}/>
{/if}

<div class="fixed right-8 bottom-0 z-50">
	{#if is_one_on_one}
		<StudentWidget {student_id} {tutor_group_id} teacher_id={$session.user_id}/>
	{:else}
		<StudentListWidget student_list={students}/>
	{/if}
</div>

<div
				class="fixed bottom-2 left-1/2 transform -translate-x-1/2 flex items-center flex-col">
	<Countdown
					{student_id}
					item_id={selected_item_id}
					start_date={start_date}
					{tutor_group_id}
          end_date={end_date}/>
</div>