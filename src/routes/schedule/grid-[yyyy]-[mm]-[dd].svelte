<script>
	import {zoom_store} from "$lib/store/zoom.js";
	import {browser} from "$app/env";

	let calendar

	const SOURCE_ID = 'id'

	$: {
		if ($zoom_store && browser && calendar) {
			reRenderEvents()
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
			initialView: 'dayGridMonth', // dayGridMonth, timeGridWeek
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