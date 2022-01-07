<script>
	import {onMount} from "svelte";
	import dayjs from "dayjs";
	export let start_date
	export let end_date
	import duration from 'dayjs/plugin/duration'
	dayjs.extend(duration)

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
<div>
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
		<div class="bg-yellow-500 text-center rounded-sm text-sm p-2">
			{hh}:{mm}:{ss}
		</div>
	{/if}
</div>