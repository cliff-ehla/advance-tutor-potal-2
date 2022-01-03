import {writable, get, derived} from "svelte/store";
import {http} from "$lib/http.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc)
dayjs.extend(timezone)
let env = import.meta.env.VITE_ENV

const create_store = () => {
	const store = writable([])
	const time_zone = writable('Asia/Hong_Kong')
	const _store = derived([store, time_zone], ([$store, $time_zone]) => {
		let time_zone_options = [
			{
				label: env === 'dev' ? 'New York' : dayjs.tz.guess().split('/')[1],
				tz: env === 'dev' ? 'America/New_York' : dayjs.tz.guess(),
			},
			{
				label: 'Hong Kong',
				tz: 'Asia/Hong_Kong'
			}
		]
		time_zone_options = time_zone_options.map(opt => {
			return {
				...opt,
				active: opt.tz === $time_zone
			}
		})
		const zoom_list = $store.map(zoom => {
			return {
				...zoom,
				start_date: dayjs.utc(zoom.start_date).tz($time_zone)
			}
		})
		const events = zoom_list.map(zoom => {
			let start = dayjs(zoom.start_date)
			let end = start.add(zoom.duration, 'minutes')
			return {
				title: zoom.students.map(s => s.nickname).join(','),
				start: start.format('YYYY-MM-DD HH:mm:ss'),
				end: end.format('YYYY-MM-DD HH:mm:ss'),
				extendedProps: zoom
			}
		})
		return {
			list: zoom_list,
			events,
			time_zone_options,
			time_zone: $time_zone
		}
	})
	const callIfNoCache = async (fetch) => {
		if (get(store).length) {
			return console.log('cached')
		}
		let start_time = dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
		let end_time = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
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