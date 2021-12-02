<script>
	import Icon from '$lib/ui/icon.svelte'
	import {page} from '$app/stores'
</script>

<div class="px-4 flex h-12 items-center border-b border-gray-300 sticky top-0 bg-white">
	<button>Today</button>
	<a href="/schedule/list" class:active={$page.path.split('/').pop() === 'list'} class="w-10 h-10 cc rounded">
		<svg viewBox="0 0 36 36" class="fill-current w-5"><path d="M11 14h25v8H11zM0 25h8v7H0zM11 25h25v7H11zM11 4h25v7H11zM0 4h8v7H0zM0 14h8v8H0z"></path></svg>
	</a>
	<a href="/schedule/month" class:active={$page.path.split('/').pop() === 'month'} class="w-10 h-10 cc">
		<Icon name="calendar"/>
	</a>
</div>

<div class="relative">
	<div class="absolute p-4">
		<div class="w-48 h-48 bg-gray-200"></div>
	</div>

	<div class="ml-56">
		<slot></slot>
	</div>
</div>

<style>
	.active {
		@apply bg-gray-200 text-blue-500;
	}
</style>