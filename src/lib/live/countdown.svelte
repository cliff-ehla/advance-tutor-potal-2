<script>
	import {onMount} from "svelte";
	import dayjs from "dayjs";
	export let start_date
	export let end_date
	export let student_id
	export let item_id
	import duration from 'dayjs/plugin/duration'
	dayjs.extend(duration)
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import RateZoom from './rate-zoom.svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Icon from "$lib/ui/icon.svelte"
	let started = false
	let ended = false
	let hh, mm, ss
	let dropdown
	$: is_one_on_one = !!student_id

	onMount(() => {
		let timer = setInterval(diff, 1000)
		diff()
		return () => {
			clearInterval(timer)
		}
	})

	const diff = () => {
		started = dayjs().isAfter(dayjs(start_date), 'second')
		ended = dayjs().isAfter(dayjs(end_date), 'second')
		if (!ended) {
			if (started) {
				let diff = dayjs(end_date).diff(dayjs())
				let d = dayjs.duration(diff)
				hh = d.hours().toString().padStart(2, '0')
				mm = d.minutes().toString().padStart(2, '0')
				ss = d.seconds().toString().padStart(2, '0')
				if (ss === '00' && mm === '00') {
					if (is_one_on_one && dropdown) dropdown.show()
					ended = true
				}
			} else {
				let diff = dayjs(start_date).diff(dayjs())
				let d = dayjs.duration(diff)
				hh = d.hours().toString().padStart(2, '0')
				mm = d.minutes().toString().padStart(2, '0')
				ss = d.seconds().toString().padStart(2, '0')
			}
		}
	}
</script>

{#if !started}
	<div class:bg-yellow-500={started} class="text-center rounded-sm text-sm px-4 py-2 bg-gray-200">
		<p class="text-gray-500">Lesson starts at</p>
		<p style="font-size: 2em" class="leading-none font-bold text-gray-400">{dayjs(start_date).format('h:mma')}</p>
		<p class="mono">Countdown: {hh}:{mm}:{ss}</p>
	</div>
{:else}
	<div class="flex">
		<div class="{ended ? 'bg-red-500' : 'bg-yellow-500'} h-5 flex items-center text-center rounded-sm text-xs px-2 py-1 mono leading-none font-bold">
			{#if ended}
				Lesson ended
			{:else}
				{mm}:{ss}
			{/if}
		</div>
		{#if is_one_on_one}
			<Dropdown open_on_hover={false} bind:this={dropdown}
			          activator_active_style="bg-yellow-500"
			          activator_style="w-5 h-5 cc bg-gray-300 ml-1 rounded-sm hover:bg-yellow-500">
				<div use:tooltip={'Click to rate'} slot="activator">
					<Icon name="star" className="w-3"/>
				</div>
				<RateZoom {student_id} {item_id}/>
			</Dropdown>
		{/if}
	</div>
{/if}

<style>
	.mono {
		font-family: monospace;
	}
</style>