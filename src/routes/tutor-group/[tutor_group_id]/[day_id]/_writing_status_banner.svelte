<script>
	import Icon from '../../../../components/ui-elements/icon.svelte'

	export let task
	export let tutor_group_id
	export let day_id
	export let user_id
	export let loading

	$: status = task.status
	$: identifier = task.identifier

	let href = `tutor-group/${tutor_group_id}/${day_id}/writing-marking/${task.identifier}?user_id=${user_id}`
</script>

<div class="px-8 max-w-screen-lg mt-4">
	{#if loading}
		<a class="block bg-gray-200 text-gray-400 text-center group cursor-pointer rounded-lg py-4">
			<p class="text-t1 font-bold mb-2">Loading...</p>
		</a>
	{:else if status === 0}
		<div class="bg-gray-200 text-gray-400 text-center rounded-lg py-4">
			<p class="text-h1">Not yet submitted</p>
		</div>
	{:else if status === 1}
		<a {href} class="block bg-blue-500 text-white text-center group cursor-pointer rounded-lg py-4">
			<p class="text-sm font-bold mb-2">The student has submitted</p>
			<button class="text-h1 px-8 py-4 rounded-full bg-black bg-opacity-10 group-hover:bg-opacity-30 inline-flex items-center transition-opacity">
				Click to grade
				<Icon name="right" className="ml-2 w-4"/>
			</button>
		</a>
	{:else if status === 2 || status === 3}
		<a {href} class="block bg-green-500 text-white text-center cursor-pointer flex items-center justify-around rounded-lg py-4 group">
			<span class="w-10"></span>
			<p class="text-h1">Marking completed</p>
			<span class="w-10">
				<button class="text px-4 py-2 rounded-full bg-black bg-opacity-20 group-hover:bg-opacity-40 ml-2 transition-opacity">Edit</button>
			</span>
		</a>
	{:else if status === 4}
		<div class="bg-red-500 text-white text-center rounded-lg py-4">
			<p class="text-h1">Rejected</p>
		</div>
	{/if}
</div>