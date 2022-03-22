<script>
	import Icon from '$lib/ui/icon.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import RateZoom from '$lib/live/rate-zoom.svelte'
	import {rating_number_to_label} from "$lib/store/rating-number-to-label.js";

	export let student_id = undefined
	export let item_id = undefined

	export let rate

	const color_map = {
		5: 'text-red-500',
		4: 'text-red-500',
		3: 'text-green-500',
		2: 'text-yellow-500',
		1: 'text-yellow-500',
	}

	const label_map = {
		1: 'Too easy',
		2: 'Easy',
		3: 'Fit',
		4: 'Hard',
		5: 'Too hard',
	}
</script>

{#if rate}
	<div class="bg-white whitespace-nowrap inline-flex items-center border border-gray-300 px-1 rounded-sm text-xs {color_map[rate]}">
		{#if rate == 3}<Icon name="tick" className="w-3 fill-current mr-1"/>{/if}
		<p>{label_map[rate]}</p>
	</div>
{:else}
	<Dropdown activator_style="whitespace-nowrap border border-gray-300 px-1 rounded-sm text-gray-400 text-xs bg-gray-200">
		<div slot="activator">
			<div class="flex items-center">
				<div class="w-1.5 h-1.5 bg-red-500 rounded"></div>
				<p class="ml-1">No rating</p>
			</div>
		</div>
		<RateZoom {student_id} {item_id}/>
	</Dropdown>
{/if}