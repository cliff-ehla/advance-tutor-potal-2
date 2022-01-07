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

	let started = false
	let ended = false
	let hh, mm, ss

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
		let diff = dayjs(end_date).diff(dayjs())
		let d = dayjs.duration(diff)
		hh = d.hours().toString().padStart(2, '0')
		mm = d.minutes().toString().padStart(2, '0')
		ss = d.seconds().toString().padStart(2, '0')
	}
</script>

<Dropdown>
	<div slot="activator">
		{#if !started}
			<div class:bg-yellow-500={started} class="text-center rounded-sm text-sm px-4 py-2 bg-gray-200">
				<p class="text-gray-500">Lesson starts at</p>
				<p style="font-size: 2em" class="leading-none font-bold text-gray-400">{dayjs(start_date).format('h:mma')}</p>
			</div>
		{:else if ended}
			<div class="bg-red-500 text-center rounded-sm text-sm p-2">
				Lesson ended
			</div>
		{:else}
			<div class="bg-yellow-500 text-center rounded-sm text-xs px-2 py-1 mono leading-none font-bold">
				{mm}:{ss}
			</div>
		{/if}
	</div>
	<RateZoom {student_id} {item_id}/>
</Dropdown>

<style>
	.mono {
		font-family: monospace;
	}
</style>