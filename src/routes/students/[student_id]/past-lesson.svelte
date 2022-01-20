<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_fans_detail', {
			student_id: page.params.student_id,
			is_current: false
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
	import ZoomPreviewMinimal from '$lib/zoom/zoom-preview-minimal.svelte'
</script>

<div class="mx-auto max-w-screen-lg">
	<div class="section-box">
		<p class="section-title">Past lessons</p>
		{#each zoom_list as zoom}
			<div class="my-4">
				<ZoomPreviewMinimal {zoom}/>
			</div>
		{/each}
	</div>
</div>