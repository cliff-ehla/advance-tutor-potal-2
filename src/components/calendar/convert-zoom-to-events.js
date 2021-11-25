import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc)
dayjs.extend(timezone)

function convertToTzDate (date_string, tz) {
	const format = 'YYYY-MM-DD HH:mm:ss'
	return dayjs(dayjs.utc(date_string).tz(tz).format(format), format)
}

export const convertZoomToEvent = (zoom, selected_time_zone) => {
	let start = convertToTzDate(zoom.start_date, selected_time_zone)
	let end = start.add(zoom.duration, 'minutes')

	let big_classroom_type = zoom.big_classroom_type
	let is_big_class = ['UNLIMITED', 'BIG'].includes(big_classroom_type)
	let is_small_class = big_classroom_type === 'SMALL'

	return {
		title: zoom.students.map(s => s.nickname).join(','),
		start: start.toDate(),
		end: end.toDate(),
		extendedProps: zoom,
		backgroundColor: is_big_class ? 'orange' : is_small_class ? '#9c27b0' : '#2F80ED'
	}
}