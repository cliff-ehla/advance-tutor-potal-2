<script>
	import {http} from "$lib/http.js";
	import {onMount} from 'svelte'
	import Reader from './index.svelte'
	import {getContext} from 'svelte'
	import {is_loading} from "$lib/store/is_loading.js";
	import Icon from "$lib/ui/icon.svelte";
	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import {fly} from "svelte/transition";

	dayjs.extend(relativeTime)
	const {openModal, closeModal} = getContext('simple-modal')

	export let item_id
	export let start_date = undefined
	export let end_date = undefined
	let pdf_json
	let ppt_link
	let youtube_links
	let reminder_visible = false

	$: is_expired = dayjs().isAfter(end_date)
	$: lesson_now = dayjs().isAfter(start_date) && dayjs().isBefore(end_date)

	onMount(async () => {
		setTimeout(() => {reminder_visible = true}, 600)
		if (item_id) {
			let {data} = await http.post(fetch, '/itemApi/get_by_ids', {
				ids: [item_id]
			})
			pdf_json = data[0].pdf_json
			ppt_link = data[0].ppt_link
			youtube_links = data[0].youtube_link
			if (ppt_link) {
				open(ppt_link, 'preview', 'popup')
				closeModal()
			}
		}
	})
</script>

{#if $is_loading}
	<div class="w-96 h-72 cc bg-black">
		<p class="text-white opacity-80">Loading...</p>
	</div>
{:else}
	{#if reminder_visible && !lesson_now}
		<div transition:fly={{y: 50}} class="fixed z-50 top-4 left-1/2 w-72 -ml-36 pl-4 pr-2 py-2 rounded-lg bg-yellow-100 border border-yellow-500 shadow-lg text-center flex items-center">
			<div class="text-yellow-800">
				{#if is_expired}
					Lesson expired <i class="underline">{dayjs(start_date).fromNow()}</i>
				{:else}
					Lesson will start <i class="underline">{dayjs(start_date).fromNow()}</i>
				{/if}
			</div>
			<button on:click={() => {reminder_visible = false}} class="cc w-6 h-6 rounded-full ml-auto bg-yellow-200 text-yellow-800 hover:bg-yellow-300">
				<Icon name="close" className="w-3"/>
			</button>
		</div>
	{/if}
	{#if pdf_json}
		<Reader close_modal_button_visible {youtube_links} pages_info_2={pdf_json}/>
	{:else}
		<button on:click={closeModal}>Close</button>
	{/if}
{/if}