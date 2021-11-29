<script>
	import Icon from './ui-elements/icon.svelte'
	export let back_path = undefined
	export let o_o_o
	export let segment
	import {stores} from '$app/stores'
	import ProfileMenu from './profile-menu.svelte'
	const {page} = stores()
	$: user_id = $page.params.user_id || $page.query.user_id

	const tabs = [
		{
			label: 'Course',
			slug: 'course'
		},
		{
			label: 'Reminder',
			slug: 'reminder'
		},
		{
			label: 'Learning history',
			slug: 'learning-history'
		},
		{
			label: 'Material from student',
			slug: 'material'
		}
	]
</script>

<div class="h-20 px-4 flex items-center border-b border-gray-300 sticky top-0 bg-white z-10">
	{#if back_path}
		<a href="{back_path}" class="-ml-4 w-6 mr-4 h-full hover:bg-gray-200 inline-flex items-center justify-center border-r border-gray-300 bg-gray-100">
			<Icon name="right2" className="w-4 transform rotate-180"/>
		</a>
	{/if}
	<img src={o_o_o.avatar_filepath} class="w-12 h-12 rounded-full" alt="avatar"/>
	<div class="ml-4 mt-auto">
		<p class="text-t1 font-bold">{o_o_o.nickname || o_o_o.username}</p>
		<div class="flex">
			{#each tabs as t}
				<a class="{t.slug === segment ? 'text-blue-500 border-b-2 border-current font-bold' : ''} py-2 mr-4 text-sm" href="/student/{user_id}/{t.slug}">{t.label}</a>
			{/each}
		</div>
	</div>

	<div class="flex-1"></div>
	<ProfileMenu/>
</div>