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
	export let zoom
	const items = zoom.days.map(d => ({
		item_id: d.item_ids[0],
		title: d.title
	}))
	const students = zoom.students
	const tutor_group_id = zoom.tutor_group_id
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

{#each items as item}
	<p>{item.title}</p>
{/each}

{#if !loading_item}
	<PdfReader pages_info_2={pdf_json}/>
{/if}