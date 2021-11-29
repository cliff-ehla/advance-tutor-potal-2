<script context="module">
	import {getUserOrgData} from "../../../api/tutor-api";
	export function load({page, session, fetch}) {
		if (!session) {
			this.redirect(302, '/login')
		} else {
			getUserOrgData(fetch)
		}
		return true
	}
</script>

<script>
	import {tutor_group_store} from "../../../store";
	import {stores} from '$app/stores'
	import Preview from '../../../components/tutor-group/preview.svelte'
	import TopBar from '../../../components/top-bar.svelte'
	const {session, page} = stores()
	const c_id = $page.params.c_id

	$: _class = $tutor_group_store ? tutor_group_store.getClass(c_id) : null
</script>

{#if _class}
	<TopBar back_path="/classes">
		<b class="text-t1">Class {_class.name}</b>
	</TopBar>
{/if}

<div class="p-8">
	{#if _class}
		{#if _class.tutor_groups.length === 0}
			<p>No course in this class</p>
		{:else}
			<div class="grid grid-cols-1 gap-6">
				{#each _class.tutor_groups as group}
					<Preview {group} c_id={_class.c_id}/>
				{/each}
			</div>
		{/if}
	{/if}
</div>