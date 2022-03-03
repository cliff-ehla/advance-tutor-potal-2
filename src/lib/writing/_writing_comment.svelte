<script>
	import {http} from "$lib/http.js";
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import SelectionBox from '$lib/writing/_selection-box.svelte'
	import {onMount} from 'svelte'
	export let marking_category

	onMount(async () => {
		let {data} = await http.get(fetch, '/writingApi/writings_comment_map')
		marking_category.forEach(cat => {
			cat.comment_template = data[cat.title]
		})
		marking_category = marking_category
	})

	const onInput = (cat, e) => {
		cat.comments = e.detail
		marking_category = marking_category
		dispatch('input', marking_category)
	}
</script>

{#each marking_category as cat}
	<div class="flex items-center py-4">
		<p class="font-bold w-32">{cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}</p>
		<div class="flex-1 px-4">
			{#if cat.comment_template}
				<SelectionBox on:input={e => onInput(cat, e)} value="{cat.comments}" options="{cat.comment_template}"/>
			{/if}
		</div>
	</div>
{/each}