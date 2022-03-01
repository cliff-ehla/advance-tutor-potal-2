<script context="module">
	import {user_info} from "$lib/store/user_info.js";
	import {noticeCenterStore} from "$lib/store/notice-center-store.js";

	export const load = async ({fetch, session}) => {
		user_info.set(session.user_info)
		return true
	}
</script>

<script>
	import {sentry} from "$lib/sentry";
	import LoadingBar from '$lib/ui/indeterminate-loading-bar.svelte'
	import {navigating} from "$app/stores";
	import '../styles/tailwind-output.css';
	import {onMount} from 'svelte'
	import Toast from '$lib/app-shelf/toast.svelte'
	import Modal from '$lib/app-shelf/modal.svelte'
	import Popup from '$lib/app-shelf/popup.svelte'
	import Popper from '$lib/app-shelf/popper.svelte'
	import TopBar from '$lib/app-shelf/top-bar.svelte'
	import Dialog from '$lib/app-shelf/dialog.svelte'
	import {session} from '$app/stores'
	import {page} from "$app/stores";

	onMount(() => {
		sentry.init()
		noticeCenterStore.fetchUnreadCount(fetch)
	})
</script>

{#if $session.user_info && !($page.path.startsWith('/zoom') || $page.path.startsWith('/item'))}
	<TopBar/>
{/if}

{#if $navigating}
	<div class="fixed inset-x-0 top-0 z-50">
		<LoadingBar/>
	</div>
{/if}
<Toast/>
<Dialog/>
<Modal>
	<Popup>
		<Popper>
			<main class="transition transition-all">
				<slot></slot>
			</main>
		</Popper>
	</Popup>
</Modal>