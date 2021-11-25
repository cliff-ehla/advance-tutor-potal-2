<script context="module">
	import {org_store, tutor_group_store} from "../../store";
	import {get} from "svelte/store";
	export function load({page, session}) {
		if (!session) {
			return {
				status: 302,
				redirect: '/login'
			}
		} else {
			if (get(org_store).o_type === 'SCHOOL') {
				return {
					status: 302,
					redirect: '/classes'
				}
			}
		}
		return true
	}
</script>

<script>
	import {stores} from '$app/stores'
	const {session, page} = stores()
	import TopBar from '../../components/top-bar.svelte'
	import Preview from '../../components/tutor-group/preview.svelte'
</script>

<TopBar>
	{#if $org_store.image_url}
		<div class="inline-flex items-center">
			<img class="w-12 h-12" src={$org_store.image_url} alt={$org_store.o_name}>
			<div class="pl-3">
				<p class="text-xs leading-tight text-gray-400">Organisation</p>
				<p class="font-bold">{$org_store.o_name}</p>
			</div>
		</div>
	{/if}
</TopBar>

<div class="max-w-screen-lg mx-auto px-8 py-8">
	<div>
		{#if $tutor_group_store.tutor_group_list.length === 0}
			<div class="p-16">
				You have no group class
			</div>
		{:else}
			{#each $tutor_group_store.tutor_group_list as group}
				<div class="my-6">
					<Preview {group}/>
				</div>
			{/each}
		{/if}
	</div>
</div>