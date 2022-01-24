<script>
	import dayjs from "dayjs";
	import DatePicker from '$lib/ui/date-picker/date-picker.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Icon from '$lib/ui/icon.svelte'
	import {tick, createEventDispatcher, getContext} from 'svelte'
	import {convertUtcSlotToLocal, convertLocalSlotToUtc} from "./parse-time-slot";
	import utc from "dayjs/plugin/utc.js";
	import EventMenu from './event-menu.svelte'
	const {showPopper} = getContext('popper')
	const {openModal} = getContext('simple-modal')
	import {http} from "$lib/http.js";
	import {dialog} from "$lib/store/dialog.js";
	import AddSlotDialog from "$lib/available-time-table/add-slot-dialog.svelte";

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

		calendar = new FullCalendar.Calendar(node, {
			initialView: 'timeGridWeek',
			height: 'calc(100vh - 100px)',
			events: converted_local_events,
			selectable: true,
			selectMirror: true,
			editable: true,
			eventStartEditable: true,
			allDaySlot: false,
			headerToolbar: false,
			dayHeaderContent: (date) => {
				let div = document.createElement('div')
				div.innerHTML = day_of_week[date.dow]
				return {
					domNodes: [div]
				}
			},
			select: e => {
				openModal(AddSlotDialog, {
					start: e.start,
					end: e.end,
					onConfirm: ({start, end}) => {
						calendar.addEventSource([{
							start, end
						}])
						save('Session added')
					}
				})
			},
			eventClick: ({event, el}) => {
				showPopper(el, EventMenu, {
					onDelete: () => {
						event.remove()
						save('Session removed')
					}
				}, {
					placement: 'right'
				})
			},
			eventDragStop: e => {
				save('Session Edited')
			},
			eventResizeStop: e => {
				save('Session Edited')
			},
		})
		calendar.render()
	}

	const save = (notification) => {
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
			dispatch('update', payload)
			http.post(fetch, '/tutorApi/set_available_time', payload, {
				notification
			})
		}, 10)
	}

	const onStartDayChange = async (e) => {
		start_day = dayjs(e.detail).format('YYYY-MM-DD HH:mm:ss')
		save('Start date updated')
		await tick()
		if (no_of_weeks <= min_no_of_week) {
			end_day = dayjs(start_day, 'YYYY-MM-DD HH:mm:ss').add(min_no_of_week, 'week')
		}
	}

	const onEndDayChange = (e) => {
		end_day = dayjs(e.detail).format('YYYY-MM-DD HH:mm:ss')
		save('End date updated')
	}

	const onDelete = () => {
		dialog.confirm({
			message: 'Delete the time slot',
			onConfirm: () => {
				http.post(fetch, '/tutorApi/delete_available_timeslot', {
					timeslot_id
				}, {
					notification: 'Timeslot deleted'
				})
			},
			onSuccess: () => {
				dispatch('delete', timeslot_id)
			}
		})
	}

	const isAllowed = (date) => {
		return dayjs(date).diff(dayjs(start_day, 'YYYY-MM-DD HH:mm:ss'), 'week') >= min_no_of_week
	}
</script>

<div class="flex px-4 py-2 items-center border-b border-gray-300">
	<div>
		<p class="note">Start date</p>
		<DatePicker on:datechange={onStartDayChange} selected={dayjs(start_day, 'YYYY-MM-DD HH:mm:ss').toDate()}/>
	</div>
	<div class="ml-4">
		<p class="note">End date</p>
		<DatePicker {isAllowed} on:datechange={onEndDayChange} selected={dayjs(end_day, 'YYYY-MM-DD HH:mm:ss').toDate()}/>
	</div>
	<div class="ml-auto flex items-center">
		<p class="p-2 mr-2 bg-gray-200 rounded text-xs">{local_timezone}</p>
		<Dropdown placement="bottom-end" activator_style="rounded-full w-8 h-8 cc">
			<button slot="activator">
				<Icon name="more" className="w-4"/>
			</button>
			<div class="dropdown">
				<div on:click={onDelete} class="item">Delete</div>
			</div>
		</Dropdown>
	</div>
</div>

<div use:renderCalendar></div>
