<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/itemApi/get_by_ids', {
			ids: [page.params.item_id]
		})
		if (!success) return onFail(debug)
		return {
			props: {
				pdf_json: data[0].pdf_json
			}
		}
	}
</script>

<script>
	import PdfReader from '../../components/item/item-pdf-reader/index.svelte'
	export let pdf_json
	console.log('cliff: ', pdf_json)
</script>

<PdfReader pages_info_2={pdf_json}/>

