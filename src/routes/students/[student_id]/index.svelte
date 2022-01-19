<script context="module">
	export function load ({page, stuff}) {
		return {
			props: {
				overview: stuff.overview
			}
		}
	}
</script>

<script>
	import ZoomPreviewMinimal from '$lib/zoom/zoom-preview-minimal.svelte'

	export let overview

	$: archive_zoom_list = overview.archive_zoom_list
	$: current_zoom_list = overview.current_zoom_list
</script>

<div class="p-4 bg-white mb-4">
	<p class="mb-4 font-bold">Upcoming lessons</p>
	{#if current_zoom_list.length}
		{#each current_zoom_list as zoom}
			<ZoomPreviewMinimal {zoom}/>
		{/each}
	{:else}
		<p class="text-gray-400">No coming lessons</p>
	{/if}
</div>

<div class="p-4 bg-white">
	<p class="mb-4 font-bold">Last 5 lessons</p>
	{#if archive_zoom_list.length}
		{#each archive_zoom_list as zoom}
			<ZoomPreviewMinimal {zoom}/>
		{/each}
	{:else}
		<p class="text-gray-400">No history</p>
	{/if}
</div>