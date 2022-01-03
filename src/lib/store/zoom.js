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
			let start_date = dayjs.utc(zoom.start_date).tz($time_zone)
			let end_date = start_date.add(zoom.duration, 'minutes')
			return {
				...zoom,
				start_date,
				end_date
			}
		})
		const events = zoom_list.map(zoom => {
			return {
				title: zoom.sub_cat || zoom.students.map(s => s.nickname).join(','),
				start: zoom.start_date.format('YYYY-MM-DD HH:mm:ss'),
				end: zoom.end_date.format('YYYY-MM-DD HH:mm:ss'),
				extendedProps: zoom
			}
		})
		return {
			list: zoom_list,
			events,
			time_zone_options,
			time_zone: time_zone_options.find(opt => opt.tz === $time_zone)
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
		const res = await http.post(fetch,'/courseApi/list_registrable_classroom', {
			start_date: start_time,
			end_date: end_time,
		})
		data.forEach(zoom => {
			res.data.forEach(zoom2 => {
				if (zoom.wrapper_id === zoom2.zoom_id) {
					zoom.sub_cat = zoom2.sub_cat
				}
			})
		})
		console.log(res.data)
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