<script context="module">
	import {org_store} from "../store";
	import {get} from 'svelte/store'
	import {getUserOrgData} from "../api/tutor-api";
	export const load = ({fetch, session}) => {
		if (!get(org_store).id) {
			getUserOrgData(fetch)
		}
		return {
			props: {
				user_info: session.user_info
			}
		}
	}
</script>

<script>
	import {sentry} from "$lib/sentry";
	import Header from '$lib/top-bar.svelte';
	import LoadingBar from '$lib/ui/indeterminate-loading-bar.svelte'
	import {navigating} from "$app/stores";
	import '../styles/tailwind-output.css';
	import {page} from '$app/stores'
	import {onMount} from 'svelte'
	import LeftBar from '../components/left-bar.svelte';
	import {left_bar_visible} from "../store";

	export let user_info

	onMount(() => {
		sentry.init()
	})
</script>

<LeftBar/>

<main class="bg-gray-100">
	{#if $navigating}
		<div class="fixed inset-x-0 top-0 z-50">
			<LoadingBar/>
		</div>
	{/if}
	<main class:ml-20={$left_bar_visible} class="transition transition-all">
		<slot />
	</main>
</main>
