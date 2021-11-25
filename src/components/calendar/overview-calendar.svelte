<script>
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import timezone from "dayjs/plugin/timezone.js";
	import {eventContent} from "./event-content";
	import {onEventClick} from "./event-click";
	import {getContext} from 'svelte'
	const {showPopper} = getContext('popper')
	const {open} = getContext('simple-modal')
	import {convertZoomToEvent} from "./convert-zoom-to-events";
	import Icon from '../ui-elements/icon.svelte'
	import {fetchZoomOverview} from "../../api/zoom-api";
	import {tutor_group_store, updated_wrapper_id_store} from "../../store";
	import Preview from "../zoom/preview.svelte";
	import {onDataClick} from "./date-click";

	dayjs.extend(utc)
	dayjs.extend(timezone)

	let calendar
	let zoom_list
	let loading
	const LOCAL_TZ = dayjs.tz.guess()
	const HK_TZ = 'Asia/Hong_Kong'
	let selected_time_zone = LOCAL_TZ

	let selected_view = 'dayGridMonth' // dayGridMonth, timeGridWeek
	let active_date = new Date()


	const fetchData = async () => {
		let start_date = dayjs(active_date).startOf('month').subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
		let end_date = dayjs(active_date).endOf('month').add(10, 'day').format('YYYY-MM-DD HH:mm:ss')
		loading = true
		zoom_list = await fetchZoomOverview({
			start_date, end_date
		}, fetch)
		zoom_list = zoom_list.filter(z => !z.is_cancel)
		loading = false
		removeAllEvents()
		setTimeout(() => {
			renderEvents(convertToEvents(zoom_list))
		}, 10)
	}

	const convertToEvents = (zoom_list) => {
		return zoom_list.map(zoom => convertZoomToEvent(zoom, selected_time_zone))
	}

	const renderEvents = (events) => {
		if (calendar) {
			let all_events = calendar.getEvents()
			if (all_events.length) {
				all_events.forEach(e => e.remove())
			}
			calendar.addEventSource(events)
		}
	}

	const initCalendar = node => {
		calendar = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth', // dayGridMonth, timeGridWeek
			dayMaxEventRows: true,
			height: "calc(100vh - 150px)",
			eventDisplay: 'block',
			eventContent
		})
		calendar.render()
		fetchData()
	}

	const removeAllEvents = () => {
		if (calendar) {
			const events = calendar.getEvents()
			events.forEach(e => e.remove())
		}
	}
</script>

<div class="relative">
	{#if loading}
		<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg">Loading</div>
	{/if}

	<div use:initCalendar></div>
</div>