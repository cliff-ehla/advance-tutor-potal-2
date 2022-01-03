<script context="module">
	export const load = ({stuff}) => {
		return {
			props: {
				zoom_list: stuff.zoom_list
			}
		}
	}
</script>


<script>
	import dayjs from "dayjs";

	export let zoom_list
	console.log('zoom_list', zoom_list)
	let calendar

	const init = (node) => {
		const events = zoom_list.map(zoom => {
			let start = dayjs(zoom.start_date)
			let end = start.add(zoom.duration, 'minutes')
			return {
				title: zoom.students.map(s => s.nickname).join(','),
				start: start.toDate(),
				end: end.toDate(),
				extendedProps: zoom
			}
		})
		calendar = new FullCalendar.Calendar(node, {
			events,
			initialView: 'dayGridMonth', // dayGridMonth, timeGridWeek
		})
		calendar.render()
	}
</script>

<div class="w-full" use:init></div>