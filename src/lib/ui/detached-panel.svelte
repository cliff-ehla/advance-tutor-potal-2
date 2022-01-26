<script>
	import Icon from '$lib/ui/icon.svelte'
	import { slide } from 'svelte/transition';
	export let height_class = 'h-72'
	export let collapsed = false
</script>

<div class="fixed shadow-lg bottom-0 right-4 w-72 bg-white border border-gray-300 rounded mt-2">
	<div on:click={() => {collapsed = !collapsed}} class="group hover:bg-gray-50 duration-100 transition-colors cursor-pointer h-12 flex items-center px-4 border-b border-gray-300">
		<slot name="header"/>
		<div class:hidden={collapsed} class="ml-auto flex items-center">
			<button class="icon-button text-gray-500">
				<Icon name="subtract" className="w-4"/>
			</button>
			<slot name="right"/>
		</div>
		{#if collapsed}
			<button class="icon-button text-gray-500 ml-auto -mr-2 group-hover:text-blue-500 group-hover:bg-blue-50">
				<Icon name="right" className="w-4 transform -rotate-90"/>
			</button>
		{/if}
	</div>
	{#if !collapsed}
	<div transition:slide class="{height_class} overflow-scroll">
		<slot/>
	</div>
	{/if}
</div>