<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				error_message: error.message,
				status
			}
		};
	}
</script>

<script>
	export let error_message;
	export let status;
	import {sentry} from "$lib/sentry";
	import Spinner from '$lib/ui/spinner.svelte'

	let is_reload = false

	if (error_message.includes('Failed to fetch dynamically imported module')) {
		is_reload = true
		window.location.reload()
	} else {
		sentry.log(error_message)
	}
</script>

<div class="container text-center py-12">
	{#if is_reload}
		<p class="mb-4">The site is updating, please wait...</p>
		<Spinner/>
	{:else}
		{#if status === 504}
			<p class="page-title">504</p>
			<p class="pb-4 text-gray-500">The page takes too long to response.</p>
			<button on:click={() => {window.location.reload()}} class="button">Reload again</button>
		{:else}
			<div class="bg-red-500 text-white inline-block p-4 rounded">
				<p style="font-size: 1.8em" class="mb-2 text-xl font-light">{status}</p>
				<h1>{@html error_message}</h1>
			</div>
		{/if}
	{/if}
</div>