<script>
	import Icon from './icon.svelte'
	import {range} from "../../utils/range";

	export let total
	export let completed
</script>

<div class="flex items-center">
	{#each range(1, total) as i}
		<div class="w-4 h-4 rounded-full cc bg-gray-300 text-white {completed >= i ? 'bg-green-500' : ''}">
			<Icon name="tick" className="w-3"/>
		</div>
		{#if i < total}
			<div class="w-2 h-1 {completed >= i ? 'bg-green-500' : 'bg-gray-300'}"></div>
		{/if}
	{/each}
</div>
