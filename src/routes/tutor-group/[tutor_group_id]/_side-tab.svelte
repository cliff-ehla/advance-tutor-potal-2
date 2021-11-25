<script>
	import {onMount} from 'svelte'
	export let tutor_group_id
	export let user_id
	export let active_tab = 'tasks'

	let lesson_tabs = [
		{
			slug: 'message',
			label: 'Messages',
			href: `/tutor-group/${tutor_group_id}/message`
		},
		{
			slug: 'zoom',
			label: 'Zoom',
			href: `/tutor-group/${tutor_group_id}/zoom`
		},
		{
			slug: 'tasks',
			label: 'App tasks',
			href: `/tutor-group/${tutor_group_id}/app-tasks`
		},
		{
			slug: 'class-history',
			label: 'Class history',
			href: `/tutor-group/${tutor_group_id}/class-history`
		}
	]

	onMount(() => {
		if (user_id) {
			lesson_tabs.forEach(tab => {
				tab.href += `?user_id=${user_id}`
			})
			lesson_tabs = lesson_tabs
		}
	})
</script>

{#if user_id}
	<div class="relative pl-36" style="min-height: calc(100vh - 118px)">
		<div class="w-36 absolute left-0 inset-y-0 border-r border-gray-300 bg-blue-100 py-8">
			{#each lesson_tabs as tab}
				<a href={tab.href} class="{tab.slug === active_tab ? 'bg-white border-blue-500 border-t border-b text-blue-500 font-bold' : ''} cursor-pointer px-4 py-2 block">{tab.label}</a>
			{/each}
		</div>
		<slot/>
	</div>
{:else}
	<slot/>
{/if}