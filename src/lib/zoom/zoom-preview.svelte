<script>
	import utc from "dayjs/plugin/utc"
	import timezone from "dayjs/plugin/timezone"
	import isBetween from 'dayjs/plugin/isBetween'
	import dayjs from 'dayjs'
	dayjs.extend(isBetween)
	dayjs.extend(utc)
	dayjs.extend(timezone)

	export let z
	export let tutor_group_id
	import Icon from '$lib/ui/icon.svelte'
	import {onMount} from 'svelte'

	// z.start_date = '2021-06-11 22:30:01'
	// console.log(z.start_date)
	const start = dayjs(z.start_date)
	let now = dayjs(new Date())
	const not_set = !z.start_date
	const day_diff = start.diff(now, 'day')
	const is_today = day_diff === 0

	let in_progress
	let expired
	let not_yet_started
	let hour_diff
	let min_diff
	let within_hour

	$: status = not_set ? 'not_set' : expired ? 'expired' : in_progress ? 'in_progress' : within_hour ? 'in_hour' : is_today ? 'today' : 'coming_soon'
	$: zoom_button_active = (within_hour || in_progress)

	$: start_time_hk = dayjs.utc(z.start_date).tz('Asia/Hong_Kong')
	$: end_time_hk = start_time_hk ? start_time_hk.add(z.duration, 'minutes') : null

	const status_to_style = {
		'not_set': 'bg-blue-100 text-red-500',
		'expired': 'bg-gray-200 text-gray-400',
		'in_progress': 'bg-yellow-500 text-black',
		'in_hour': 'bg-green-500 text-white',
		'today': 'bg-green-500 text-white',
		'coming_soon': 'bg-blue-100 text-blue-500'
	}

	const update = () => {
		now = dayjs()
		hour_diff = start_time_hk.diff(now, 'hour')
		min_diff = start_time_hk.diff(now, 'minute') % 60
		expired = now.isAfter(end_time_hk)
		in_progress = now.isBetween(start_time_hk, end_time_hk)
		within_hour = start_time_hk.diff(now, 'minute') < 60
		not_yet_started = now.isBefore(start_time_hk)
	}

	onMount(() => {
		let timer_id
		update()
		if (is_today) {
			hour_diff = start.diff(now, 'hour')
			timer_id = setInterval(update, 1000)
		}
		return () => {
			if (timer_id) clearInterval(timer_id)
		}
	})
</script>

<div class="rounded bg-white border border-gray-300 overflow-hidden">
	<div class="{status_to_style[status]} flex px-4 h-8 items-center">
		{#if not_set}
			<p class="text-xs font-bold uppercase">No date</p>
			<p class="text-xxs ml-2">Your tutor have not set the class time</p>
		{:else if expired}
			<p class="text-xs font-bold uppercase">Class completed</p>
		{:else if not_yet_started}
			{#if within_hour}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{min_diff} Minutes to start</p>
				</div>
			{:else if is_today}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{hour_diff} Hours to start</p>
				</div>
			{:else}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{day_diff} Days to start</p>
				</div>
			{/if}
		{:else if in_progress}
			<p class="text-xs font-bold uppercase">In progress</p>
		{/if}
	</div>
	<div class="p-4">
		<div class="flex items-center mb-4">
			<svg class="w-12" viewBox="0 0 49 57" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M1.10526 46.9736V26.7104C1.10526 25.1446 2.30262 23.9473 3.86841 23.9473H8.74999H27.9079H32.7895C34.3553 23.9473 35.5526 25.1446 35.5526 26.7104V46.9736" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M18.3289 32.421C23.0088 32.421 26.8026 28.6272 26.8026 23.9473C26.8026 19.2674 23.0088 15.4736 18.3289 15.4736C13.6491 15.4736 9.85526 19.2674 9.85526 23.9473C9.85526 28.6272 13.6491 32.421 18.3289 32.421Z" fill="white"/>
				<path d="M18.3289 29.6584C21.4828 29.6584 24.0395 27.1017 24.0395 23.9478C24.0395 20.794 21.4828 18.2373 18.3289 18.2373C15.1751 18.2373 12.6184 20.794 12.6184 23.9478C12.6184 27.1017 15.1751 29.6584 18.3289 29.6584Z" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M29.8421 44.1186C29.8421 37.7634 24.6842 32.6055 18.3289 32.6055C11.9737 32.6055 6.81578 37.7634 6.81578 44.1186" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M32.6053 44.1182H4.05263V46.9734H32.6053V44.1182Z" fill="white"/>
				<path d="M24.1316 51.3027H12.6184V55.6317H24.1316V51.3027Z" stroke="#7989BE" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M35.6447 46.9736H1.10526V48.5394C1.10526 50.1052 2.30262 51.3026 3.86841 51.3026H32.8816C34.4474 51.3026 35.6447 50.1052 35.6447 48.5394V46.9736Z" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M9.85526 55.6318H26.8947" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M26.1579 32.421V23.9473C26.1579 19.2499 29.9342 15.4736 34.6316 15.4736H40.3421C45.0395 15.4736 48.8158 19.2499 48.8158 23.9473C48.8158 28.6447 45.0395 32.421 40.3421 32.421H26.1579Z" fill="white"/>
				<path d="M34.7237 18.2373H40.4342C43.6579 18.2373 46.1447 20.8163 46.1447 23.9478C46.1447 27.1715 43.5658 29.6584 40.4342 29.6584H28.9211V23.9478C28.9211 20.7241 31.5 18.2373 34.7237 18.2373Z" stroke="#F5AB35" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M40.4342 23.9473H34.7237" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M18.3289 6.63142V0.920898" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M11.1447 8.56594L9.76317 6.0791" stroke="#7989BE" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M5.89474 13.9083L0.921051 10.9609" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M30.8553 13.9083L35.8289 10.9609" stroke="#0086F9" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M25.6053 8.56594L26.9868 6.0791" stroke="#7989BE" stroke-width="1.84211" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<div class="ml-4 flex-1">
				<p class="font-bold uppercase text-xs">Online class</p>
				{#if z.title}
					<p class="text-t2">{z.title}</p>
				{:else}
					<p class="text-t2 text-gray-300">No class title</p>
				{/if}
			</div>
			<div class="ml-4">
				<img class="w-12 h-12 rounded-full" src={z.image_url} alt="org logo">
			</div>
		</div>
		<div class="flex items-center mb-2">
			<Icon name="calendar"/>
			<div class="ml-4 text-xs text-blue-500">{start_time_hk.format('MMM D, h:mm A')}</div>
		</div>
		<div class="flex items-center mb-2">
			<Icon name="stopwatch"/>
			<div class="ml-4 text-xs">{z.duration} minutes</div>
		</div>
		<div class="flex items-center mb-2">
			<Icon name="avatar"/>
			<div class="ml-4 text-xs">{z.teacher_nickname}</div>
		</div>
		{#if zoom_button_active}
			<a target="_blank" href={z.zoom_link} class="block bg-blue-500 hover:bg-blue-700 text-white mt-4 text-center px-12 py-2 rounded font-bold w-full">
				<p>Join the class now</p>
			</a>
		{:else if !expired}
			<button disabled class="bg-gray-200 text-gray-300 mt-4 text-center px-12 py-2 rounded font-bold w-full">
				Join the class now
			</button>
		{/if}
	</div>
</div>