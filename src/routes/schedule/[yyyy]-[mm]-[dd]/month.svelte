<script>
	import {zoom_store} from "$lib/store/zoom.js";
	import {browser} from "$app/env";
	import ZoomPreviewPopup from '$lib/zoom/zoom-preview-popup.svelte'
	import {getContext} from 'svelte'
	import {page} from "$app/stores"
	import {eventContent} from "$lib/calendar/event-content.js";

	const {showPopper, closePopper} = getContext('popper')

	let calendar

	const SOURCE_ID = 'id'

	$: {
		if ($zoom_store && browser && calendar) {
			reRenderEvents()
		}
	}

	$: {
		if ($page.params.mm && calendar) {
			const {dd, mm, yyyy} = $page.params
			const data = `${yyyy}-${mm}-${dd}`
			calendar.gotoDate(data)
		}
	}

	const init = (node) => {
		calendar = new FullCalendar.Calendar(node, {
			eventSources: [
				{
					events: $zoom_store.events,
					id: SOURCE_ID
				}
			],
			eventContent,
			height: 'calc(100vh - 120px)',
			headerToolbar: false,
			initialView: 'dayGridMonth',
			eventClick: ({event, el}) => {
				let zoom = event.extendedProps
				showPopper(el, ZoomPreviewPopup, {
					zoom
				}, {
					placement: 'right'
				})
			}
		})
		calendar.render()
	}

	const reRenderEvents = () => {
		const source = calendar.getEventSourceById(SOURCE_ID)
		if (source) {
			source.remove()
			calendar.addEventSource({
				id: SOURCE_ID,
				events: $zoom_store.events
			})
		}
	}
</script>

<div class="w-full" use:init></div>