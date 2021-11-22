<script context="module">
	export const load = ({session}) => {
		return {
			props: {
				user_info: session.user_info
			}
		}
	}
</script>

<script>
	import Header from '$lib/top-bar.svelte';
	import LoadingBar from '$lib/ui/indeterminate-loading-bar.svelte'
	import {navigating} from "$app/stores";
	import '../styles/tailwind-output.css';
	import {page} from '$app/stores'

	export let user_info
</script>

{#if $page.path !== '/login'}
	<Header {user_info}/>
{/if}

<main class="bg-gray-100">
	{#if $navigating}
		<div class="fixed inset-x-0 top-0 z-50">
			<LoadingBar/>
		</div>
	{/if}
	<slot />
</main>
