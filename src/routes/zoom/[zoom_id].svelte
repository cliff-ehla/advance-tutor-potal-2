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
	import ReadonlyWriting from '$lib/writing/read-only-index.svelte'
	import {session} from '$app/stores'
	import Icon from '$lib/ui/icon.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Spinner from '$lib/ui/Spinner.svelte'
	import Countdown from '$lib/live/countdown.svelte'
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {onMount} from "svelte";
	import {tooltip} from "$lib/action/tooltip.js";
	import {setContext} from "svelte";

	dayjs.extend(utc)

	onMount(async () => {
		let {data, success} = await http.post(fetch, '/tutorApi/writing_submission_list_by_tutor_group_id', {
			tutor_group_id: zoom.tutor_group_id
		})
		if (success) {
			writing_submission = data
			writing_submission.sort((a,b) => {
				return a.submission_date > b.submission_date ? -1 : 1
			})
			last_writing_submission = writing_submission[0]
		}
		getItem()
	})

	export let zoom
	let start_date = dayjs.utc(zoom.start_date).local()
	let end_date = dayjs(start_date).add(zoom.duration, 'minutes')
	start_date = start_date.format('YYYY-MM-DD HH:mm:ss')
	end_date = end_date.format('YYYY-MM-DD HH:mm:ss')
	const items = zoom.days.map(d => ({
		item_id: d.item_ids && d.item_ids[0],
		title: d.title
	})).filter(item => {
		return item.item_id
	})
	const students = zoom.students
	const tutor_group_id = zoom.tutor_group_id
	const is_one_on_one = !zoom.big_classroom_type
	const student_id = is_one_on_one ? students[0].user_id : null
	let selected_item_id = items.length && items[0].item_id
	let pdf_json
	let pdf_array
	let youtube_link_obj
	let loading_item = true
	let writing_submission = []
	let selected_writing_identifier
	let last_writing_submission
	let fullscreen_el
	let is_fullscreen

	import PdfReader from '$lib/pdf-reader/index.svelte'

	const getItem = async () => {
		if (!selected_item_id) return loading_item = false
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
				pdf_array = data[0].pdf_array
				youtube_link_obj = data[0].youtube_link_obj
				loading_item = false
			}
		}
	}

	const onItemSelected = (item) => {
		selected_writing_identifier = null
		selected_item_id = item.item_id
		getItem()
	}

	const onWritingSelected = (identifier) => {
		selected_item_id = null
		selected_writing_identifier = identifier
	}

	const onToggleFullScreen = () => {
		if (!document.fullscreenElement) {
			fullscreen_el.requestFullscreen();
			is_fullscreen = true
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
				is_fullscreen = false
			}
		}
	}

	setContext('live', {
		toggleFullScreen: onToggleFullScreen
	})
</script>

<div bind:this={fullscreen_el} class="bg-white">

	<div class="h-10 items-center flex relative z-50 px-2">
		<button use:tooltip={'Back'} on:click={() => {history.back()}}
		        class="w-8 h-8 shadow-lg border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 bg-white rounded-full cc mr-2">
			<Icon name="right" className="transform rotate-180 w-3"/>
		</button>
		{#each items as item}
			<button class:text-blue-500={item.item_id === selected_item_id}
			   on:click={() => {onItemSelected(item)}}
			   class="px-2 py-1 cursor-pointer rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 mx-1 text-sm">
				{item.title}
			</button>
		{/each}
		{#if writing_submission}
			{#if last_writing_submission}
				<div class="cursor-pointer rounded bg-gray-100 border border-gray-300 mx-1 text-sm flex items-stretch">
					<button class:text-blue-500={selected_writing_identifier === last_writing_submission.identifier}
					        on:click={() => {onWritingSelected(last_writing_submission.identifier)}}
					        class="flex items-center hover:bg-white pl-2 pr-1">
						<Icon name="report" className="w-4"/>
						<p use:tooltip={'Last writing submission'} class="py-1 ml-1 text-sm">{last_writing_submission.title}</p>
					</button>
					<Dropdown
									placement="bottom-end"
									activator_active_style="text-blue-500 bg-white"
									activator_style="px-1 py-1 border-l border-gray-300">
						<button slot="activator">
							<Icon name="more" className="w-3"/>
						</button>
						<div class="dropdown">
							{#each writing_submission as w}
								<div on:click={() => {onWritingSelected(w.identifier)}} class="item text-left">
									<div class="flex items-center w-full">
										<p>{w.title}</p>
										<div class="ml-auto flex items-center">
											<p class="text-xs text-gray-500 mx-1 bg-gray-100 rounded-full px-1">{dayjs(w.submission_date).format('DD MMM')}</p>
											{#if w.disclose === '1'}
												<div class="ml-2 w-5 h-5 rounded-full cc bg-blue-100 text-blue-700" style="font-size: 10px">{Number(w.organizations_mark) + Number(w.vocabulary_mark) + Number(w.sentence_mark) + Number(w.content_mark)}</div>
											{:else}
												<div use:tooltip={'Not yet marked'} class="ml-2">
													<Icon name="alert" className="w-3 text-gray-500"/>
												</div>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Dropdown>
				</div>
			{/if}
		{/if}
		<button on:click={onToggleFullScreen} class="px-2 py-1 cursor-pointer rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 mx-1 text-sm ml-auto">
			<Icon name="{!is_fullscreen ? 'expand' : 'collapse'}" className="w-5 text-gray-500"/>
		</button>
	</div>

	<div class="fixed right-8 bottom-0 z-50">
		{#if is_one_on_one}
			<StudentWidget {student_id} {tutor_group_id} teacher_id={$session.user_id}/>
		{:else}
			<StudentListWidget student_list={students}/>
		{/if}
	</div>

	<div class="fixed z-30 bottom-2 left-1/2 transform -translate-x-1/2 flex items-center flex-col">
		<Countdown
						{student_id}
						item_id={selected_item_id}
						start_date={start_date}
						{tutor_group_id}
						end_date={end_date}/>
	</div>

	{#if !loading_item}
		{#if selected_writing_identifier}
			<div class="p-4 max-w-screen-xl">
				<ReadonlyWriting identifier={selected_writing_identifier}/>
			</div>
		{:else if pdf_json}
			<PdfReader {pdf_array} {youtube_link_obj} pages_info_2={pdf_json}/>
		{/if}
		{#if !(selected_item_id && pdf_json) && !selected_writing_identifier}
			<div class="text-center">
				<p class="p-4 text-gray-500">This is no material uploaded for this class</p>
				<button class="button" on:click={() => {history.back()}}>Back</button>
			</div>
		{/if}
	{:else}
		<div class="text-center p-4">
			<Spinner/>
		</div>
	{/if}
</div>