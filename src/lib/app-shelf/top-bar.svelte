<script>
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import {session} from '$app/stores'
	import {page} from '$app/stores'

	let nav_items = [
		{
			href: '/schedule',
			title: 'Schedule'
		},
		{
			href: '/course',
			title: 'Course'
		}
	]
</script>

<div class="h-16 items-center flex px-4 border-gray-300 border-b">
	<a href="/" class="inline-block mr-4">
		<img src="/logo.png" alt="logo" class="w-10 mx-auto">
	</a>
	{#each nav_items as item}
		<a class="p-2" class:font-bold={$page.path.includes(item.href)} href={item.href}>{item.title}</a>
	{/each}
	<div class="ml-auto">
		<Dropdown placement="bottom-end">
			<div slot="activator" class="inline-flex items-center">
				<div class="rounded-full w-10 h-10 bg-cover bg-center" style="background-image: url({$session.user_info.profile_pic})"></div>
				<div class="ml-2 leading-none">
					<p class="text-xs text-gray-500">Teacher</p>
					<p class="max-w-xs text-sm text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis">
						{$session.user_info.nickname}
					</p>
				</div>
			</div>
			<div class="bg-white shadow-lg py-4 rounded border border-gray-300">
				<div class="h-0.5 bg-gray-200 my-1 mx-4"></div>

			</div>
		</Dropdown>
	</div>
</div>