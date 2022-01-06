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

	$: {
		if (zoom_list) {
			renderEvents(convertToEvents(zoom_list, selected_time_zone))
		}
	}

	$: {
		if ($updated_wrapper_id_store) {
			setTimeout(() => {
				let zoom = $tutor_group_store.entity.zoom[$updated_wrapper_id_store]
				let id = `wrapper_${$updated_wrapper_id_store}`
				let base_el = document.getElementById(id)
				showPopper(base_el, Preview, {
					z: zoom,
					tutor_group_id: zoom.tutor_group_id
				}, {
					placement: 'bottom'
				})
			}, 100)
		}
	}

	const convertToEvents = (zoom_list) => {
		return zoom_list.map(zoom => convertZoomToEvent(zoom, selected_time_zone))
	}

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
			eventContent,
			eventClick: ({event, el}) => {
				const onRateSuccess = () => {
					fetchData()
				}
				onEventClick({event, el}, open, calendar, onRateSuccess)
			},
			headerToolbar: false
		})
		calendar.render()
		fetchData()
	}

	const onNextMonth = () => {
		calendar.next()
		active_date = calendar.getDate()
		fetchData()
	}

	const onPrevMonth = () => {
		calendar.prev()
		active_date = calendar.getDate()
		fetchData()
	}

	const onChangeView = view => {
		calendar.changeView(view)
		selected_view = view
	}

	const changeTimeZone = time_zone => {
		selected_time_zone = time_zone
		removeAllEvents()
		setTimeout(() => {
			renderEvents(convertToEvents(zoom_list))
		}, 10)
	}


	const removeAllEvents = () => {
		if (calendar) {
			const events = calendar.getEvents()
			events.forEach(e => e.remove())
		}
	}
</script>

<div class="flex items-center justify-between h-16 relative">
	<div class="flex items-center pl-4">
		<button class="focus:outline-none transform rotate-180 w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onPrevMonth}>
			<Icon className="w-4" name="right"/>
		</button>
		<p style="font-size: 1.8em" class="mx-8">{dayjs(active_date).format('MMMM YYYY')}</p>
		<button class="focus:outline-none w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onNextMonth}>
			<Icon className="w-4" name="right"/>
		</button>
	</div>

	<div class="flex items-center pr-4">
		<div class="h-12 px-1 inline-flex items-center border border-gray-400 rounded">
			<button on:click={() => {onChangeView('dayGridMonth')}} class="w-10 h-10 flex items-center justify-center {selected_view === 'dayGridMonth' ? 'bg-blue-100 text-blue-500' : ''}">
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="fill-current w-6"><path d="M31.5 0H36v36H0V0H31.5zM2.7 32.822h30.6V8.47H2.7v24.352z"></path><path d="M4.503 10.588h5.4v5.294h-5.4zM4 25v6h6v-6H4zm5 5H5v-4h4v4zM11 25v6h6v-6h-6zm5 5h-4v-4h4v4zM4 18v6h6v-6H4zm5 5H5v-4h4v4zM18 25v6h6v-6h-6zm5 5h-4v-4h4v4zM25 25v6h6v-6h-6zm5 5h-4v-4h4v4zM11 18v6h6v-6h-6zm5 5h-4v-4h4v4zM18 18v6h6v-6h-6zm5 5h-4v-4h4v4zM25 18v6h6v-6h-6zm5 5h-4v-4h4v4zM11 11v6h6v-6h-6zm5 5h-4v-4h4v4zM18 11v6h6v-6h-6zm5 5h-4v-4h4v4zM25 11v6h6v-6h-6zm5 5h-4v-4h4v4z"></path></svg>
			</button>
			<button on:click={() => {onChangeView('timeGridWeek')}} class="w-10 h-10 flex items-center justify-center {selected_view === 'timeGridWeek' ? 'bg-blue-100 text-blue-500' : ''}">
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="fill-current w-6"><path d="M0 5v27h36V5H0zm11 24H3V11h8v18zm11 0h-8V11h8v18zm11 0h-8V11h8v18z"></path></svg>
			</button>
		</div>
		<div class="h-12 px-1 inline-flex items-center border border-gray-400 rounded ml-4">
			<button on:click={() => {changeTimeZone(HK_TZ)}} class="py-2 px-2 {selected_time_zone === HK_TZ ? 'bg-blue-100 text-blue-500' : ''}">HK Time</button>
			<button on:click={() => {changeTimeZone(LOCAL_TZ)}} class="py-2 px-2 {selected_time_zone === LOCAL_TZ ? 'bg-blue-100 text-blue-500' : ''}">Local Time</button>
		</div>
	</div>
</div>


<div class="relative">
	{#if loading}
		<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg">Loading</div>
	{/if}

	<div use:initCalendar></div>
</div>