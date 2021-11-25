<script>
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import timezone from "dayjs/plugin/timezone.js";

	let calendar

	const initCalendar = node => {
		calendar = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth', // dayGridMonth, timeGridWeek
			dayMaxEventRows: true,
			height: "calc(100vh - 150px)",
			eventDisplay: 'block',
			eventContent: [], // TODO

		})
		calendar.render()
		// fetchData()
	}
</script>

<div use:initCalendar></div>