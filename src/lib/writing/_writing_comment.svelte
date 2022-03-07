<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import SelectionBox from '$lib/writing/_selection-box.svelte'
	export let marking_category

	const onInput = (cat, e) => {
		cat.comments = e.detail
		marking_category = marking_category
		dispatch('input', marking_category)
	}
</script>

{#each marking_category as cat}
	<div class="flex items-start py-2">
		<p class="text-gray-700 w-28 text-right pt-4">{cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}</p>
		<div class="flex-1 px-4">
			{#if cat.comment_template}
				<SelectionBox on:input={e => onInput(cat, e)} value="{cat.comments}" options="{cat.comment_template}"/>
			{/if}
		</div>
	</div>
{/each}