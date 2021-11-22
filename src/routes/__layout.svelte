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

	export let user_info
</script>

<Header {user_info}/>

<main>
	<slot />
</main>

<footer>
	<p>EHLA</p>
</footer>
