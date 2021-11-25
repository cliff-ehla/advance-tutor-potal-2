<script>
	import Icon from '../ui-elements/icon.svelte'
	import {stores} from '@sapper/app'
	import ProfileMenu from '../profile-menu.svelte'
	import {org_store} from "../../store";
	import {tutor_group_store} from "../../store";

	export let tutor_group
	export let segment
	export let c_id
	export let back_path = undefined

	const {page} = stores()
	$: user_id = $page.params.user_id || $page.query.user_id
	$: is_school = $org_store.o_type === 'SCHOOL'

	const tabs = [
		{
			label: 'Zoom',
			slug: 'zoom'
		},
		{
			label: 'App tasks',
			slug: 'app-tasks'
		},
		{
			label: 'Note',
			slug: 'note'
		},
		{
			label: 'Messages',
			slug: 'tutor-group-messages'
		}
	]
</script>

<div class="h-20 px-4 flex items-center border-b border-gray-300 sticky top-0 bg-white z-10">
	{#if back_path}
		<a href="{back_path}" class="-ml-4 w-6 mr-4 h-full hover:bg-gray-200 inline-flex items-center justify-center border-r border-gray-300 bg-gray-100">
			<Icon name="right2" className="w-4 transform rotate-180"/>
		</a>
	{/if}
	{#if is_school}
		<a href="/classes/{c_id}" class="w-12 h-12 rounded flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white text-t1">
			{$tutor_group_store ? tutor_group_store.getClassName(c_id) : ''}
		</a>
		<p class="text-t1 font-bold ml-4">{tutor_group.title}</p>
	{:else}
		<Icon name="user-group"/>
		<div class="ml-4">
			<p class="text-t1 font-bold">{tutor_group.title}</p>
			<div class="flex">
				{#each tabs as t}
					<a class="{t.slug === segment ? 'text-blue-500 border-b-2 border-current font-bold' : ''} py-2 mr-4 text-sm"
					   href="/tutor-group/{tutor_group.tutor_group_id}/{t.slug}">{t.label}</a>
				{/each}
			</div>
		</div>
	{/if}

	<div class="flex-1"></div>
	<ProfileMenu/>
</div>