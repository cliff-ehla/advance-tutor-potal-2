<script>
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Icon from '$lib/ui/icon.svelte'
	import {session} from '$app/stores'
	import {page} from '$app/stores'
	import {user_info} from "$lib/store/user_info.js";
	import {noticeCenterStore} from "$lib/store/notice-center-store.js";
	import {is_loading} from "$lib/store/is_loading.js";
	import IncomeMessagePreview from '$lib/notice-center/income-message-preview.svelte'

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
</script>

<div class="h-14 items-center flex border-gray-300 border-b px-4 relative sticky bg-white z-30 top-0 inset-x-0">
	<a href="/" class="inline-flex items-center ml-1">
		<img src="/logo.png" alt="logo" class="w-8 mx-auto">
		<p class="ml-2 text-lg font-light leading-none mt-0.5 text-gray-500">EHLA</p>
	</a>
	<div class="flex items-center justify-center ml-6">
		{#each nav_items as item}
			<a class="relative h-14 flex items-center p-2 mx-1 font-light hover:bg-blue-50" class:text-blue-500={$page.path.includes(item.href)} href={item.href}>
				{item.title}
				{#if $page.path.includes(item.href)}
					<span class="absolute block h-1 bg-blue-400 inset-x-0 bottom-0 rounded-full"></span>
				{/if}
			</a>
		{/each}
	</div>
	<div class="ml-auto flex items-center">
		<Dropdown placement="bottom-end" open_on_hover={false}>
			<button slot="activator" on:click={() => {noticeCenterStore.fetchMessage(fetch)}} class="relative w-10 h-10 cc rounded-full hover:bg-gray-100 hover:text-blue-500">
				<Icon className="w-4 text-gray-500 hover:text-current" name="bell"/>
				<div class="absolute bg-pink-500 text-white px-0.5 leading-tight rounded-sm top-1 right-1" style="font-size: 8px">
					{$noticeCenterStore.unread_count}
				</div>
			</button>
			<div class="dropdown w-72">
				{#if $is_loading}
					loading...
				{:else}
					{#each $noticeCenterStore.message_list as m}
						<IncomeMessagePreview message={m}/>
					{/each}
				{/if}
			</div>
		</Dropdown>
		<a href="/conversation"
		   class="w-8 h-8 cc rounded-full transition-colors focus:text-blue-300 hover:bg-blue-50 mr-2 {$page.path.includes('conversation') ? 'bg-blue-50 text-blue-500' : 'text-gray-600'}">
			<Icon name="chat" className="w-5"/>
		</a>
		<Dropdown placement="bottom-end" activator_active_style="bg-gray-200" activator_style="bg-gray-100 border border-gray-300 w-6 h-6 rounded-full inline-flex items-center justify-center">
			<div slot="activator">
				<Icon name="info" className="w-3"/>
			</div>
			<div class="dropdown">
				<a target="_blank" href="https://ehla-media-bucket.s3.ap-southeast-1.amazonaws.com/pdf/User+guide_teaching+portal_10Jan2022(1)+(1).pdf" class="item">
					<Icon name="download" className="w-4 mr-2"/>
					<span class="flex-1">User guide</span>
				</a>
				<a target="_blank" href="https://ehla-media-bucket.s3.ap-southeast-1.amazonaws.com/pdf/EHLA+Teacher+administrative+stuff_v31Dec2021(1).pdf" class="item">
					<Icon name="download" className="w-4 mr-2"/>
					<span class="flex-1">Administrative stuff</span>
				</a>
			</div>
		</Dropdown>
		<Dropdown placement="bottom-end" activator_style="rounded-full ml-3">
			<div slot="activator">
				<div class="rounded-full w-8 h-8 bg-cover bg-center" style="background-image: url({$session.user_info.profile_pic})"></div>
			</div>
			<div class="dropdown w-56">
				<p class="text-sm text-gray-500 p-2">{$session.user_info.nickname}</p>
				<a href="/salary" class="item">My salary</a>
				<a href="/workday-setting/available" class="item">Workday setting</a>
				<a href="/logout" class="item">Logout</a>
			</div>
		</Dropdown>
	</div>
</div>