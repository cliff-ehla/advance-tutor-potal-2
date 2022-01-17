<script>
	export let item_id

	import {getItem} from "../../../api/item-api";
	import {onMount} from 'svelte'
	import Reader from './index.svelte'

	let pdf_json

	onMount(async () => {
		if (item_id) {
			let data = await getItem(item_id, fetch)
			pdf_json = data.pdf_json
		}
	})
</script>

{#if pdf_json}
	<Reader pages_info_2={pdf_json} top_offset={200}/>
{/if}