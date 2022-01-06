<script>
	import Icon from '$lib/ui/icon.svelte'

	export let rate

	const color_map = {
		5: 'text-red-500',
		4: 'text-red-500',
		3: 'text-green-500',
		2: 'text-yellow-500',
		1: 'text-yellow-500',
	}

	const label_map = {
		1: 'Too easy',
		2: 'Easy',
		3: 'Fit',
		4: 'Hard',
		5: 'Too hard',
	}
</script>

{#if rate}
	<div class="inline-flex items-center border border-gray-300 px-1 rounded-sm {color_map[rate]}">
		{#if rate == 3}
			<Icon name="tick" className="w-3 fill-current"/>
		{:else if rate == 1 || rate == 5}
			<Icon name="alert" className="w-4 fill-current"/>
		{:else}
			<div class="w-2 h-2 rounded-full bg-current"></div>
		{/if}
		<p class="ml-1">{label_map[rate]}</p>
	</div>
{/if}