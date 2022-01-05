<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/zoom_list', {
			tutor_group_id: page.params.tutor_group_id,
			child_id: page.params.user_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				zoom_list: data
			}
		}
	}
</script>

<script>
	export let zoom_list
	import ZoomPreview from '$lib/zoom/zoom-preview.svelte'
	console.log(zoom_list)
</script>

{#each zoom_list as zoom}
	<ZoomPreview {zoom}/>
{/each}