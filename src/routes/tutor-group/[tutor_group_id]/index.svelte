<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/zoom_list', {
			tutor_group_id: page.params.tutor_group_id
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
	import Preview from '$lib/zoom/zoom-preview.svelte'
	import {tutor_group_store} from "../../../store";
	import {page} from "$app/stores"

	export let zoom_list
	$: tg = $tutor_group_store ? tutor_group_store.getTutorGroup($page.params.tutor_group_id) : null
</script>

<h1 class="font-bold">{tg && tg.title}</h1>
{#each zoom_list as zoom}
	<Preview {zoom}/>
{/each}