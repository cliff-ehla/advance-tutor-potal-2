<script>
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Icon from '$lib/ui/icon.svelte'
	import {session} from '$app/stores'
	import {page} from '$app/stores'
	import {user_info} from "$lib/store/user_info.js";

	let nav_items = [
		{
			href: '/schedule',
			title: 'Schedule'
		},
		{
			href: '/course',
			title: 'Course'
		},
		{
			href: '/students',
			title: 'Student'
		}
	]
	console.log('123: ', $session.user_info, $user_info)
</script>

<div class="h-14 items-center flex border-gray-300 border-b px-4 relative">
	<a href="/" class="inline-flex items-center ml-1">
		<img src="/logo.png" alt="logo" class="w-8 mx-auto">
		<p class="ml-2 text-lg font-light leading-none mt-0.5 text-gray-500">EHLA</p>
	</a>
	<div class="flex items-center justify-center ml-6">
		{#each nav_items as item}
			<a class="relative h-14 flex items-center p-2 mx-1 font-light" class:text-blue-500={$page.path.includes(item.href)} href={item.href}>
				{item.title}
				{#if $page.path.includes(item.href)}
					<span class="absolute block h-1 bg-blue-400 inset-x-0 bottom-0 rounded-full"></span>
				{/if}
			</a>
		{/each}
	</div>
	<div class="ml-auto mr-2">
		<button class="w-10 h-10 cc rounded-full hover:bg-gray-100 hover:text-blue-500">
			<Icon className="w-4 text-gray-500 hover:text-current" name="bell"/>
		</button>
	</div>
	<div>
		<Dropdown placement="bottom-end">
			<div slot="activator" class="inline-flex items-center">
				<div class="rounded-full w-8 h-8 bg-cover bg-center" style="background-image: url({$session.user_info.profile_pic})"></div>
			</div>
			<div class="dropdown w-56">
				<p class="text-sm text-gray-500 p-2">{$session.user_info.nickname}</p>
				<a href="/salary" class="item">My salary</a>
				<a href="/logout" class="item">Logout</a>
			</div>
		</Dropdown>
	</div>
</div>