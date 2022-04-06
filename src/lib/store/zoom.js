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
	const month_log = writable([])
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
				end_date,
				start_date_utc: zoom.start_date
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
	const cacheFirst = (fetch, {month}) => {
		if (get(month_log).includes(month)) {
			return {
				success: true
			}
		} else {
			return fetchData(fetch, {month})
		}
	}
	const fetchData = async (fetch, {month}) => {
		month_log.update(arr => [...arr, month])
		const key = month + '-01'
		let {data, success, debug} = await http.post(fetch,'/zoomApi/advanced_zoom_list_all_for_tutor', {
			start_time: dayjs(key).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
			end_time: dayjs(key).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
		})
		if (!success) return {data, success, debug}
		data = data.filter(d => !!d.start_date)
		store.update(v => {
			return [...v, ...data]
		})
		return {data, success, debug}
	}
	const setTimeZoom = (tz) => {
		time_zone.set(tz)
	}
	return {
		subscribe: _store.subscribe,
		cacheFirst,
		fetchData,
		setTimeZoom
	}
}

export const zoom_store = create_store()