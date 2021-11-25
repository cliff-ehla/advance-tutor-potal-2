<script>
	export let students
	export let flex_wrap = false
	import Icon from '../ui-elements/icon.svelte'
</script>

<div class="flex whitespace-nowrap" class:flex-wrap={flex_wrap}>
	{#if students.length === 0}
		<p class="text-xs text-gray-400">No students in this group</p>
	{:else if students.length > 3}
		{#each students.slice(0,3) as s}
			<div class="items-center inline-flex pr-2 mr-1 mb-0.5 bg-gray-200 rounded-full leading-none">
				<Icon name="avatar" className="w-4 mr-1"/>
				<p class="text-xs overflow-hidden overflow-ellipsis" style="max-width: 6em">{s.username}</p>
			</div>
		{/each}
		<div class="items-center inline-flex px-1 bg-gray-200 rounded-full leading-none" title={students.map(s => s.username).slice(3,students.length).join(", ")}>
			<p class="text-xs">+{students.length - 3}</p>
		</div>
	{:else}
		{#each students as s}
			<div class="items-center inline-flex pr-2 mr-1 mb-0.5 bg-gray-200 rounded-full leading-none">
				<Icon name="avatar" className="w-4 mr-1"/>
				<p class="text-xs overflow-hidden overflow-ellipsis" style="max-width: 6em">{s.username}</p>
			</div>
		{/each}
	{/if}
</div>