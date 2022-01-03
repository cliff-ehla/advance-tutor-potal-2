import {writable, get, derived} from "svelte/store";
import {http} from "$lib/http.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc)

const create_store = () => {
	const store = writable([])
	const time_zone = writable('Asia/Hong_Kong')
	const _store = derived([store, time_zone], ([$store, $time_zone]) => {
		const zoom_list = $store.map(zoom => {
			return {
				...zoom,
				start_date: dayjs.utc(zoom.start_date).local()
			}
		})
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
		return {
			list: zoom_list,
			events,
			time_zone: $time_zone
		}
	})
	const callIfNoCache = async (fetch) => {
		if (get(store).length) {
			return console.log('cached')
		}
		let start_time = dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
		let end_time = dayjs().add(3, 'month').format('YYYY-MM-DD HH:mm:ss')
		const {data} = await http.post(fetch, '/zoomApi/zoom_list_all', {
			start_time,
			end_time
		})
		store.set(data)
	}
	const setTimeZoom = (tz) => {
		time_zone.set(tz)
	}
	return {
		subscribe: _store.subscribe,
		callIfNoCache,
		setTimeZoom
	}
}

export const zoom_store = create_store()