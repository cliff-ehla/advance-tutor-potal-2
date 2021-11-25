import dayjs from "dayjs";
import ZoomDayList from "../zoom/zoom-day-list-dialog.svelte";

function convertToTzDate (date_string, tz) {
	const format = 'YYYY-MM-DD HH:mm:ss'
	return dayjs(dayjs.utc(date_string).tz(tz).format(format), format)
}

export const onDataClick = (info, zoom_list, selected_time_zone, openModal) => {
	let selected_day_zoom_list = zoom_list.filter(z => {
		return convertToTzDate(z.start_date, selected_time_zone).isSame(dayjs(info.date), 'day')
	})
	if (selected_day_zoom_list.length) {
		openModal(ZoomDayList, {
			date: info.date,
			zoom_list: selected_day_zoom_list
		}, {
			closeOnAnyClick: true,
			styleWindow: {
				maxWidth: '26em',
				borderRadius: '1em'
			},
			styleContent: {
				overflow: 'hidden',
				padding: '0'
			}
		})
	}
}