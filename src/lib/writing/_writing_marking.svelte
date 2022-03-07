<script>
	export let marking_category
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import {range} from "$lib/helper/range";

	$: total_max_mark = marking_category.reduce((a,c) => a += Number(c.max_mark), 0)
	$: total_user_mark = marking_category.reduce((a,c) => a += Number(c.user_mark), 0)

	const onClick = (cat, i) => {
		cat.user_mark = i
		marking_category = marking_category
		dispatch('input', marking_category)
	}
</script>

{#each marking_category as cat}
	<div class="flex items-center py-4 text-gray-400">
		<p class="w-28 text-gray-600 text-right">{cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}</p>
		<div class="flex-1 px-4">
			<div class="flex bg-white border-gray-300 border rounded shadow-inner">
				{#each range(0, cat.max_mark) as i}
					<div on:click={() => {onClick(cat, i)}}
					     class:bg-yellow-500={cat.user_mark == i && (i / cat.max_mark) >= 0.5 && (i / cat.max_mark) <= 0.8}
					     class:bg-red-500={cat.user_mark == i && (i / cat.max_mark) < 0.5}
					     class:bg-green-500={cat.user_mark == i && (i / cat.max_mark) > 0.8}
					     class="h-4 border-l border-gray-300 flex-1 cursor-pointer shadow-inner relative group">
						<div class="absolute inset-0 hidden group-hover:block z-10 bg-black bg-opacity-20"></div>
					</div>
				{/each}
			</div>
		</div>
		<div class="w-16 flex items-center justify-end">
			<p class="font-bold leading-none">{cat.user_mark || 0}</p>
			<p class="mx-1">/</p>
			<p>{cat.max_mark}</p>
		</div>
	</div>
{/each}

<div class="flex py-4 border-t border-gray-300 items-center text-gray-400">
	<div class="flex-1 text-right leading-none">Total:</div>
	<div class="w-20 flex items-center justify-end">
		<p class="font-bold leading-none">{total_user_mark}</p>
		<p class="mx-1">/</p>
		<p>{total_max_mark}</p>
	</div>
</div>