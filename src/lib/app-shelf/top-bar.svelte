<script>
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Icon from '$lib/ui/icon.svelte'
	import Spinner from '$lib/ui/spinner.svelte'
	import {session} from '$app/stores'
	import {page} from '$app/stores'
	import {noticeCenterStore} from "$lib/store/notice-center-store.js";
	import {is_loading} from "$lib/store/is_loading.js";
	import IncomeMessagePreview from '$lib/notice-center/income-message-preview.svelte'
	import IncomeNotePreview from '$lib/notice-center/income-note-preview.svelte'

	let nav_items = [
		{
			href: '/schedule',
			title: 'Schedule'
		},
		{
			href: '/course',
			title: 'My class'
		},
		{
			href: '/students',
			title: 'Students'
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
		<Dropdown open_on_hover={false} placement="bottom-end"
		          activator_active_style="bg-blue-50"
		          activator_style="icon-button mx-1">
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
		<Dropdown activator_style="rounded-full text-gray-900 relative mx-2 active:text-blue-400"
		          activator_active_style="bg-blue-50 text-blue-500"
		          placement="bottom-end" open_on_hover={false}>
			<button slot="activator" class="icon-button" on:click={() => {noticeCenterStore.fetchNoticeAndMessage(fetch)}}>
				<Icon className="w-5" name="bell"/>
				{#if $noticeCenterStore.unread_count > 0}
					<div class="font-bold absolute rounded-full w-4 h-4 cc bg-pink-500 text-white leading-none rounded-sm top-0 right-0" style="font-size: 9px">
						{$noticeCenterStore.unread_count}
					</div>
				{/if}
			</button>
			<div class="dropdown w-72">
				{#if $is_loading}
					<div class="p-4"><Spinner/></div>
				{:else}
					{#if $noticeCenterStore.master_list.length}
						{#each $noticeCenterStore.master_list.slice(0,6) as m}
							{#if m.tutor_group_id}
								<IncomeMessagePreview message={m}/>
							{:else}
								<IncomeNotePreview message={m}/>
							{/if}
						{/each}
						<a href="/notification" class="mt-2 see-all-button">See all notifications ({$noticeCenterStore.master_list.length})</a>
					{:else}
						<img src="/notification-empty-2.png" alt="inbox-empty" class="w-36 mx-auto"/>
						<p class="text-xl text-gray-300 text-center pb-4">You inbox is empty</p>
					{/if}
				{/if}
			</div>
		</Dropdown>
		<a href="/conversation"
		   class="w-8 h-8 cc rounded-full transition-colors focus:text-blue-300 hover:bg-blue-50 mx-2 {$page.path.includes('conversation') ? 'bg-blue-50 text-blue-500' : 'text-gray-600'}">
			<Icon name="chat" className="w-5"/>
		</a>
		<Dropdown open_on_hover={false} placement="bottom-end" activator_style="rounded-full ml-3">
			<div slot="activator">
				<div class="rounded-full w-8 h-8 bg-cover bg-center" style="background-image: url({$session.user_info.profile_pic})"></div>
			</div>
			<div class="dropdown w-56">
				<p class="text-sm text-gray-500 p-2">{$session.user_info.nickname}</p>
<!--				<a href="/salary" class="item">My salary</a>-->
				<a href="/workday-setting/available" class="item">Workday setting</a>
				<a href="/logout" class="item">Logout</a>
			</div>
		</Dropdown>
	</div>
</div>