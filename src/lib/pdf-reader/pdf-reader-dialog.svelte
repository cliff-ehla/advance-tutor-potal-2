<script>
	import {http} from "$lib/http.js";
	import {onMount} from 'svelte'
	import Reader from './index.svelte'
	import {getContext} from 'svelte'
	import {is_loading} from "$lib/store/is_loading.js";
	import Icon from "$lib/ui/icon.svelte";
	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime.js";
	import {fly} from "svelte/transition";

	dayjs.extend(relativeTime)
	const {openModal, closeModal} = getContext('simple-modal')

	export let item_id
	export let start_date = undefined
	export let end_date = undefined
	let pdf_json
	let ppt_link
	let youtube_link_obj

	$: is_expired = dayjs().isAfter(end_date)
	$: lesson_now = dayjs().isAfter(start_date) && dayjs().isBefore(end_date)

	onMount(async () => {
		if (item_id) {
			let {data} = await http.post(fetch, '/itemApi/get_by_ids', {
				ids: [item_id]
			})
			pdf_json = data[0].pdf_json
			ppt_link = data[0].ppt_link
			youtube_link_obj = data[0].youtube_link_obj
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
	{#if pdf_json}
		<Reader close_modal_button_visible {youtube_link_obj} pages_info_2={pdf_json}/>
	{:else}
		<div class="w-96 h-72 cc bg-white rounded text-center">
			<div>
				<p class="mb-4">Material not ready yet</p>
				<button class="button" on:click={closeModal}>Close</button>
			</div>
		</div>
	{/if}
{/if}