<script>
	import ProfileMenu from './profile-menu.svelte'
	import Icon from './ui-elements/icon.svelte'
	export let back_path = undefined
</script>

<div class="h-20 px-4 flex items-center border-b border-gray-300 sticky top-0 bg-white z-10">
	{#if back_path}
		{#if typeof back_path === 'string'}
			<a href="{back_path}" class="-ml-4 w-6 mr-4 h-full hover:bg-gray-200 inline-flex items-center justify-center border-r border-gray-300 bg-gray-100">
				<Icon name="right2" className="w-4 transform rotate-180"/>
			</a>
		{:else}
			<button on:click={() => {history.back()}} class="-ml-4 w-6 mr-4 h-full hover:bg-gray-200 inline-flex items-center justify-center border-r border-gray-300 bg-gray-100">
				<Icon name="right2" className="w-4 transform rotate-180"/>
			</button>
		{/if}
	{/if}
	<slot/>
	<div class="flex-1"></div>
	<ProfileMenu/>
</div>