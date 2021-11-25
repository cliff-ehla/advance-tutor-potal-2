<script>

	import {org_store} from "../../store";
	import TopBar from '../../components/top-bar.svelte'
	$:{
		console.log($org_store)
	}

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
