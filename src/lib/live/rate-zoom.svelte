<script>
	import {markZoomRating} from "../../api/zoom-api";

	export let onRateSuccess = () => {}
	export let is_standalone_style = false

	export let t_difficulty_rate = undefined
	export let student_id
	export let item_id

	let loading

	const map = {
		1: 'Too easy',
		2: 'Easy',
		3: 'Fit',
		4: 'Hard',
		5: 'Too hard',
	}

	const onRate = async value => {
		if (loading) return
		loading = true
		await markZoomRating(fetch, {
			student_id,
			item_id,
			t_difficulty_rate: value
		})
		loading = false
		onRateSuccess(value)
	}
</script>

<div class="bg-green-500 px-4 py-2 text-center {is_standalone_style ? 'shadow-lg rounded-lg' : ''}">
	<p class="text-center mb-2 text-white border-b border-white border-opacity-50 inline-block text-sm">Does the material fit for the level of the student?</p>
	<div class="flex font-bold justify-center">
		{#each [1,2,3,4,5] as opt}
			<div class="mx-2 w-8 text-center">
				<button on:click={() => {onRate(opt)}}
				        class="{t_difficulty_rate === opt ? 'opacity-100' : 'opacity-80'} relative w-8 h-8 rounded-full flex items-center justify-center bg-white mb-1 hover:opacity-100">
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