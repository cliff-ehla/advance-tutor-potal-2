<script>
	export let item_id

	import {getItem} from "../../../api/item-api";
	import {onMount} from 'svelte'
	import Reader from './index.svelte'
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')

	let pdf_json
	let ppt_link

	onMount(async () => {
		if (item_id) {
			let data = await getItem(item_id, fetch)
			pdf_json = data.pdf_json
			ppt_link = data.ppt_link
			if (ppt_link) {
				open(ppt_link, 'preview', 'popup')
				closeModal()
			}
		}
	})
</script>

{#if pdf_json}
	<Reader pages_info_2={pdf_json} top_offset={200}/>
{/if}