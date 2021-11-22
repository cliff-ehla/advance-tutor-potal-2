<script context="module">
	import {http} from "$lib/http";

	export const load = async ({fetch}) => {
		const {success, data, debug} = await http.post(fetch, '/zoom/zoom_list_all', {})
		if (!success) {
			if (debug.err_code === 401) {
				return {
					status: 302,
					redirect: '/login'
				}
			} else {
				return {
					error: debug
				}
			}
		}
		return {
			props: {
				zoom_list: data
			}
		}
	}
</script>

<script>
	import ZoomPreview from '$lib/zoom/zoom-preview.svelte'
	export let zoom_list
</script>

{#each zoom_list as z}
	<ZoomPreview {z} />
{/each}

<svelte:head>
	<title>Home</title>
</svelte:head>

