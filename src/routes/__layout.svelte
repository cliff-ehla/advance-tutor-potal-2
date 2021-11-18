<script context="module">
	import {http} from "$lib/http";

	export const load = async ({fetch, page}) => {
		const res = await http.get(fetch, '/user/user_info')
		// TODO handle 404
		return {
			props: {
				user_info: res.data && res.data[0]
			}
		}
	}
</script>

<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	export let user_info
</script>

{#if user_info}
	<h1 class="font-bold m-10">{user_info.username}</h1>
{/if}
<Header />

<main>
	<slot />
</main>

<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
