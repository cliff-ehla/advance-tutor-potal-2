<script>
	import Icon from '$lib/ui/icon.svelte'

	export let student_list
	let is_collapsed = false
</script>

<div class="w-48 bg-white shadow-lg border border-gray-300 rounded flex flex-col transition-all {!is_collapsed ? '' : 'h-12'}">
	<div on:click={() => {is_collapsed = !is_collapsed}} class="cursor-pointer group flex items-center border-b border-gray-300">
		<div class="flex-1 px-4 flex items-center">
			Students list
		</div>
		<div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
			<button class="focus:outline-none h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-gray-100">
				<Icon name="{is_collapsed ? 'right' : 'close'}" className="w-4 text-gray-500 transform transition-transform {is_collapsed ? 'rotate-90' : '-rotate-90'}"/>
			</button>
		</div>
	</div>

	<div class="flex-1 px-4 py-2 overflow-y-scroll" style="max-height: 300px">
		{#each student_list as s}
			<p class="border-b border-gray-200 my-1 py-1 relative">
				{#if s.is_trial_vip === "1"}
					<span class="absolute w-2 h-2 -left-2 top-0">*</span>
				{/if}
				{s.nickname}
			</p>
		{/each}
	</div>
</div>