<script>
	import RateLabel from '$lib/zoom/rate-label.svelte'
	export let zoom_list
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	const isPast = (zoom) => {
		return dayjs.utc(zoom.start_date).local().isBefore(dayjs())
	}
</script>

<div>
{#each zoom_list as zoom, i}
	<div class="flex relative pb-2">
		<div class="w-4 h-4 border border-green-500 rounded-full {!isPast(zoom) ? 'bg-white' : 'bg-green-500'}">
			{#if i < zoom_list.length - 1}
				<div class="absolute w-0.5 bg-green-500 inset-y-0 ml-1.5 top-1/2 h-full"></div>
			{/if}
		</div>
		<div class="ml-4">
			<p class="text-gray-500">
				{dayjs(zoom.start_date).format('DD MMM, h:mma')}
			</p>
			<div>
				{#if zoom.days.length}
					{#each zoom.days as d}
						<div class="cursor-pointer hover:text-blue-700 hover:bg-gray-200 flex items-center mb-1 group rounded">
							<p class="leading-tight">{d.title}</p>
							<div class="ml-2">
								<RateLabel rate={d.t_difficulty_rate}/>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-gray-300">- No material -</p>
				{/if}
			</div>
		</div>
	</div>
{/each}
</div>