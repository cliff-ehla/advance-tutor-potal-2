import {writable} from "svelte/store";
import {http} from "$lib/http.js";
import {sentry} from "$lib/sentry.js";

const create_store = () => {
	const store = writable({})
	const fetchZoomList = async (fetch, {tutor_group_id}) => {
		const p1 = http.post(fetch, '/zoomApi/zoom_list', {
			tutor_group_id
		})
		let p2 = http.post(fetch, '/tutorApi/writing_submission_list_by_tutor_group_id', {
			tutor_group_id
		})
		const [res1, res2] = await Promise.all([p1,p2])
		const {data, success, debug} = res1
		const data2 = res2.data
		if (!success || !res2.success) return {data, success, debug}
		data2.forEach(writing => {
			const day_id = writing.day_id
			let match_lesson = data.find(tg => {
				const first_day = tg.days[0]
				const _day_id = first_day && first_day.day_id
				return _day_id === day_id || _day_id === day_id - 1
			})
			if (match_lesson) {
				match_lesson.writing = writing
			} else {
				sentry.log(`writing submission (day_id: ${day_id}) cannot mapped to zoom list`)
			}
		})
		store.update(v => ({
			...v,
			[tutor_group_id]: data
		}))
		return {data, success, debug}
	}
	return {
		fetchZoomList,
		subscribe: store.subscribe
	}
}

export const course_store = create_store()