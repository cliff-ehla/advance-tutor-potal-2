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
	import Header from '$lib/header/Header.svelte';
	import '../styles/tailwind-output.css';
	import {page} from '$app/stores'

	export let user_info
</script>

{#if $page.path !== '/login'}
	<Header {user_info}/>
{/if}

<main class="bg-gray-100">
	<slot />
</main>
