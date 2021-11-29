<script context="module">
	import {tutor_group_store} from "../../store";
	import {getUserOrgData} from "../../api/tutor-api";
	export function load({page, session}) {
		if (!session) {
			return {
				status: 302,
				redirect: '/login'
			}
		} else {
			getUserOrgData(fetch)
		}
		return true
	}
</script>

<script>
	import TopBar from '../../components/top-bar.svelte'
	import {stores} from '$app/stores'
	const {session, page} = stores()
	import {org_store} from "../../store";
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

<div class="p-6">
	<div class="max-w-screen-lg">
		{#if $tutor_group_store.class_list.length === 0}
			<div class="p-16 text-gray-400">
				You have no students
			</div>
		{:else}
			{#each $tutor_group_store.class_list as c}
				<div class="border border-gray-300 rounded-lg overflow-hidden mb-4">
					<a href="/classes/{c.c_id}" class="p-8 flex items-center bg-gray-100 shadow border-b border-gray-300 hover:text-blue-500 group hover:bg-white">
						{c.name}
					</a>
				</div>
			{/each}
		{/if}
	</div>
</div>