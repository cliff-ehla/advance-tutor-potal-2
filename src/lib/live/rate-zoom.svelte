<script>
	import {http} from "$lib/http.js";
	import {is_loading} from "$lib/store/is_loading";
	import {triggerReload} from "$lib/helper/trigger-reload.js";
	import {tooltip} from "$lib/action/tooltip.js";
	import {slack} from "$lib/helper/slack.js";

	export let onRateSuccess = () => {}
	export let t_difficulty_rate = undefined
	export let student_id
	export let item_id

	const map = {
		1: 'Too easy',
		2: 'Easy',
		3: 'Fit',
		4: 'Hard',
		5: 'Too hard',
	}

	const onRate = async (value, e) => {
		if ($is_loading) return
		await http.post(fetch, '/zoomApi/set_zoom_material_rating', {
			student_id,
			item_id,
			t_difficulty_rate: value
		}, {
			notification: `You rated: ${map[value]}`
		})
		if (value !== 3) {
			slack.send(`This item ${item_id} is ${map[value]} for student ${student_id}`)
		}
		triggerReload()
		onRateSuccess(value)
	}
</script>

<div class="rounded-lg shadow-lg bg-green-500 px-4 py-2 text-center">
	<p class="text-center mb-2 text-white border-b border-white border-opacity-50 inline-block text-sm">Does the material fit for the level of the student?</p>
	<div class="flex font-bold justify-center">
		{#each [1,2,3,4,5] as opt}
			<div class="mx-2 w-8 text-center">
				<button use:tooltip={map[opt]} on:click={(e) => {onRate(opt, e)}}
				        class="{t_difficulty_rate === opt ? 'opacity-100' : 'opacity-70'} relative w-8 h-8 rounded-full flex items-center justify-center bg-white mb-1 hover:opacity-100">
					{opt}
					{#if t_difficulty_rate === opt}
						<span class="w-10 h-10 border-2 border-white absolute -inset-1 rounded-full"></span>
					{/if}
				</button>
			</div>
		{/each}
	</div>
	<div class="flex justify-center">
		<div class="flex justify-between text-white text-xs w-60">
			<p>Too easy</p>
			<p>Fit</p>
			<p>Too hard</p>
		</div>
	</div>
</div>