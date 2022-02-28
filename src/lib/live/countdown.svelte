<script>
	import {onMount} from "svelte";
	import dayjs from "dayjs";
	export let start_date
	export let end_date
	export let student_id
	export let item_id
	export let tutor_group_id
	import duration from 'dayjs/plugin/duration'
	dayjs.extend(duration)
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import RateZoom from './rate-zoom.svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Icon from "$lib/ui/icon.svelte"
	import MessageWidgetForGroup from '$lib/live/message-widget-for-group.svelte'
	import relativeTime from "dayjs/plugin/relativeTime.js";
	dayjs.extend(relativeTime)

	let status
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
		if (dayjs().isAfter(dayjs(end_date), 'second')) {
			status = 'ended'
		} else if (dayjs().isBefore(dayjs(start_date), 'second')) {
			if (dayjs(start_date).isToday()) {
				status = 'ready_to_start_today'
			} else {
				status = 'upcoming'
			}
		} else {
			status = 'in_progress'
		}
		if (status !== 'ended') {
			if (status === 'started') {
				let diff = dayjs(end_date).diff(dayjs())
				let d = dayjs.duration(diff)
				hh = d.hours().toString().padStart(2, '0')
				mm = d.minutes().toString().padStart(2, '0')
				ss = d.seconds().toString().padStart(2, '0')
				if (ss === '00' && mm === '00') {
					if (is_one_on_one && dropdown) dropdown.show()
					status = 'ended'
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

{#if status === 'ready_to_start_today'}
	{#if !is_one_on_one}
		<div class="flex justify-end w-full">
			<MessageWidgetForGroup {tutor_group_id}/>
		</div>
	{/if}
	<!-- show count down to lesson start if 'ready_to_start_today' -->
	<div class="text-center rounded-sm text-sm px-4 py-2 bg-gray-200">
		<p class="text-gray-500">Lesson will start at</p>
		<p style="font-size: 2em" class="leading-none font-bold text-gray-400">{dayjs(start_date).format('h:mma')}</p>
		<p class="mono bg-yellow-300 mt-1">{hh}h {mm}m {ss}s</p>
	</div>
{:else}
	<div class="flex items-center">
		{#if status === 'ended'}
			<div class="bg-red-500 h-5 flex items-center text-center rounded-sm text-xs px-2 py-1 leading-none font-bold">
				Lesson ended
			</div>
		{:else if status === 'upcoming'}
			<div class="bg-yellow-100 border-yellow-500 border h-5 flex items-center text-center rounded-sm text-xs px-2 py-1 leading-none font-bold">
				Lesson will start <i class="underline ml-1">{dayjs(start_date).fromNow()}</i>
			</div>
		{:else if status === 'in_progress'}
			<div class="bg-yellow-500 h-5 flex items-center text-center rounded-sm text-xs px-2 py-1 mono leading-none font-bold">
				{mm}:{ss}
			</div>
		{/if}
		{#if is_one_on_one && ['in_progress', 'ended'].includes(status)}
			<Dropdown open_on_hover={false} bind:this={dropdown}
			          activator_active_style="bg-yellow-500"
			          activator_style="w-5 h-5 cc bg-gray-300 ml-1 rounded-sm hover:bg-yellow-500">
				<div use:tooltip={'Click to rate'} slot="activator">
					<Icon name="star" className="w-3"/>
				</div>
				<RateZoom {student_id} {item_id}/>
			</Dropdown>
		{/if}
		{#if !is_one_on_one && ['in_progress'].includes(status)}
			<div class="ml-1">
				<MessageWidgetForGroup secondary {tutor_group_id}/>
			</div>
		{/if}
	</div>
{/if}

<style>
	.mono {
		font-family: monospace;
	}
</style>