<script>
	import dayjs from "dayjs";
	import DatePicker from '../ui-elements/date-picker/date-picker.svelte'
	import Dropdown from '../ui-elements/dropdown3.svelte'
	import Icon from '../ui-elements/icon.svelte'
	import {tick, createEventDispatcher, getContext} from 'svelte'
	import {convertUtcSlotToLocal, convertLocalSlotToUtc} from "./parse-time-slot";
	import {setTutorAvailableTimeSlot, deleteTutorAvailableTimeSlot} from "../../api/tutor-api";
	import utc from "dayjs/plugin/utc.js";
	import EventMenu from './event-menu.svelte'
	const {showPopper} = getContext('popper')
	const {showNotification} = getContext('notification')

	export let timeslot_id
	export let start_day
	export let end_day
	export let events
	export let min_no_of_week = 10
	const dispatch = createEventDispatcher()
	dayjs.extend(utc)

	const local_timezone = dayjs.tz.guess()

	let calendar
	const day_of_week = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat']
	$: no_of_weeks = dayjs(end_day, 'YYYY-MM-DD HH:mm:ss').diff(dayjs(start_day, 'YYYY-MM-DD HH:mm:ss'), 'week')

	const renderCalendar = (node) => {
		let local_events = convertUtcSlotToLocal(events, local_timezone)
		let converted_local_events = []
		local_events.forEach(event => {
			converted_local_events.push({
				title: 'available',
				start: dayjs().day(event.week).format("YYYY-MM-DD") + " " + event.start_time,
				end: dayjs().day(event.week).format("YYYY-MM-DD") + " " + event.end_time
			})
		})
		console.log('converted_local_events', converted_local_events)

		calendar = new FullCalendar.Calendar(node, {
			initialView: 'timeGridWeek',
			height: 'calc(100vh - 100px)',
			events: converted_local_events,
			selectable: true,
			selectMirror: true,
			editable: true,
			eventStartEditable: true,
			select: e => {
				let new_event = {
					start: e.start,
					end: e.end
				}
				calendar.addEventSource([new_event])
				showNotification('Time session added')
				save()
			},
			eventClick: ({event, el}) => {
				showPopper(el, EventMenu, {
					onDelete: () => {
						event.remove()
						showNotification('Time session removed')
						save()
					}
				}, {
					placement: 'right'
				})
			},
			eventDragStop: e => {
				save()
				showNotification('Time session Edited')
			},
			eventResizeStop: e => {
				save()
				showNotification('Time session Edited')
			},
			dayHeaderContent: (date) => {
				let div = document.createElement('div')
				div.innerHTML = day_of_week[date.dow]
				return {
					domNodes: [div]
				}
			},
			allDaySlot: false,
			headerToolbar: false
		})
		calendar.render()
	}

	const save = () => {
		setTimeout(() => {
			let events = calendar.getEvents()
			let computed_events = events.map(e => {
				let week = dayjs(e.start).day()
				let start_time = dayjs(e.start).format('HH:mm:ss')
				let end_time = dayjs(e.end).format('HH:mm:ss')
				return {
					week,
					start_time,
					end_time
				}
			})
			let utc_slots = convertLocalSlotToUtc(computed_events)

			const payload = {
				timeslot_id,
				start_time: dayjs(start_day).format('YYYY-MM-DD HH:mm:ss'),
				end_time: dayjs(end_day).format('YYYY-MM-DD HH:mm:ss'),
				timeslot: utc_slots
			}
			console.log('utc_slots', start_day, end_day)
			dispatch('update', payload)
			setTutorAvailableTimeSlot(payload)
			// console.log('call api update: ', payload)
		}, 10)
	}

	const onStartDayChange = async (e) => {
		start_day = dayjs(e.detail).format('YYYY-MM-DD HH:mm:ss')
		save()
		await tick()
		if (no_of_weeks <= min_no_of_week) {
			end_day = dayjs(start_day, 'YYYY-MM-DD HH:mm:ss').add(min_no_of_week, 'week')
		}
	}

	const onEndDayChange = (e) => {
		end_day = dayjs(e.detail).format('YYYY-MM-DD HH:mm:ss')
		save()
	}

	const onDelete = () => {
		console.log('delete!')
		deleteTutorAvailableTimeSlot({timeslot_id})
		dispatch('delete', timeslot_id)
	}

	const isAllowed = (date) => {
		return dayjs(date).diff(dayjs(start_day, 'YYYY-MM-DD HH:mm:ss'), 'week') >= min_no_of_week
	}
</script>

<div class="flex m-4 items-center">
	<div>
		<p class="text-gray-400 text-sm">Start date</p>
		<DatePicker on:datechange={onStartDayChange} selected={dayjs(start_day, 'YYYY-MM-DD HH:mm:ss').toDate()}/>
	</div>
	<div class="ml-4">
		<p class="text-gray-400 text-sm">End date</p>
		<DatePicker {isAllowed} on:datechange={onEndDayChange} selected={dayjs(end_day, 'YYYY-MM-DD HH:mm:ss').toDate()}/>
	</div>
	<div class="ml-4">
		<p class="text-gray-400 text-sm">Number of weeks</p>
		<div class="p-1 text-center bg-gray-100">{no_of_weeks} weeks</div>
	</div>
	<div class="ml-auto flex items-center">
		<p class="p-2 mr-2 bg-gray-200 rounded font-bold">{local_timezone}</p>
		<Dropdown placement="bottom-end">
			<div slot="activator">
				<button class="w-10 h-10 rounded outline-none flex items-center justify-center">
					<Icon name="more" className="w-6"/>
				</button>
			</div>
			<div class="bg-white shadow-lg min-w-xs">
				<div on:click={onDelete} class="p-4 cursor-pointer hover:bg-gray-200 hover:text-red-500">Delete</div>
			</div>
		</Dropdown>
	</div>
</div>

<div use:renderCalendar></div>
