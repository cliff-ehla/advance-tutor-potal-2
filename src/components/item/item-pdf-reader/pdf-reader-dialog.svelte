<script>
	import {http} from "$lib/http.js";
	import {onMount} from 'svelte'
	import Reader from './index.svelte'
	import {getContext} from 'svelte'
	import {is_loading} from "$lib/store/is_loading.js";
	const {openModal, closeModal} = getContext('simple-modal')

	export let item_id
	let pdf_json
	let ppt_link

	onMount(async () => {
		if (item_id) {
			let {data} = await http.post(fetch, '/itemApi/get_by_ids', {
				ids: [item_id]
			})
			pdf_json = data[0].pdf_json
			ppt_link = data[0].ppt_link
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
		<Reader pages_info_2={pdf_json} top_offset={200}/>
	{:else}
		<button on:click={closeModal}>Close</button>
	{/if}
{/if}