<script>
	import {tutor_group_store} from "../../../store";
	import {stores} from '$app/stores'
	import Preview from '../../../components/tutor-group/preview.svelte'
	import TopBar from '../../../components/student-top-bar.svelte'
	const {session, page} = stores()
	const user_id = $page.params.user_id

	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO(user_id) : null
</script>

{#if o_o_o}
	<TopBar {o_o_o} segment="course"/>
{/if}

<div class="p-8">
	{#if o_o_o}
		<div class="grid grid-cols-1 gap-6">
			{#each o_o_o.tutor_groups as group}
				<Preview {group} {user_id}/>
			{/each}
		</div>
	{/if}
</div>