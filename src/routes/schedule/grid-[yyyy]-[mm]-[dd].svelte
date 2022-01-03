<script>
	import {zoom_store} from "$lib/store/zoom.js";
	let calendar

	const init = (node) => {
		calendar = new FullCalendar.Calendar(node, {
			events: $zoom_store.events,
			initialView: 'dayGridMonth', // dayGridMonth, timeGridWeek
		})
		calendar.render()
	}
</script>

<div class="w-full" use:init></div>