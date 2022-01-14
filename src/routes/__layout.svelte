<script context="module">
	import {org_store} from "../store";
	import {get} from 'svelte/store'
	import {getUserOrgData} from "../api/tutor-api";
	import {user_info} from "$lib/store/user_info.js";
	export const load = async ({fetch, session}) => {
		user_info.set(session.user_info)
		if (!get(org_store).id) {
			await getUserOrgData(fetch)
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
	import LoadingBar from '$lib/ui/indeterminate-loading-bar.svelte'
	import {navigating} from "$app/stores";
	import '../styles/tailwind-output.css';
	import {onMount} from 'svelte'
	import Notification from '../components/app-shelf/notification.svelte'
	import Modal from '../components/app-shelf/modal.svelte'
	import Popup from '../components/app-shelf/popup.svelte'
	import Popper from '../components/app-shelf/popper.svelte'
	import TopBar from '$lib/app-shelf/top-bar.svelte'
	import {session} from '$app/stores'
	import {page} from "$app/stores";
	import {http} from "$lib/http.js";

	export let user_info

	onMount(async () => {
		sentry.init()
		let r = await http.post(fetch, '/tutorApi/list_zoom_status_in_tutor_group')
		console.log('cliff: ', r)
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

<Notification>
	<Modal>
		<Popup>
			<Popper>
				<main class="transition transition-all">
					<slot></slot>
				</main>
			</Popper>
		</Popup>
	</Modal>
</Notification>