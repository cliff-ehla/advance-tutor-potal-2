<script>
	import {is_loading} from "$lib/store/is_loading.js";
	import Spinner from '$lib/ui/spinner.svelte'
</script>

<div class="h-72 cc text-center">
	<div>
		{#if !$is_loading}
			<p class="page-title mb-4">No conversation found.</p>
			<p class="note">
				You don't have any ongoing 1-on-1 courses.
			</p>
		{:else}
			<Spinner/>
		{/if}
	</div>
</div>