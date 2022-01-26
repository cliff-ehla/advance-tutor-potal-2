import {get, writable} from "svelte/store";
import {http} from "$lib/http.js";

const create_store = () => {
	const store = writable({})
	const cacheFirst = (fetch) => {
		const cache = get(store)
		if (cache.one_on_one) {
			fetchData(fetch)
			return {success: true, data: cache}
		} else {
			return fetchData(fetch)
		}
	}
	const fetchData = async (fetch) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_zoom_status_in_tutor_group')
		store.set(data)
		return {data, success, debug}
	}
	const getTutorGroup = (tutor_group_id) => {
		const cache = get(store)
		const one_on_one = cache ? cache.one_on_one : undefined
		return one_on_one ? one_on_one.find(tg => tg.id === tutor_group_id) : undefined
	}
	const getStudent = tutor_group_id => {
		const tg = getTutorGroup(tutor_group_id)
		if (tg) {
			return tg.students[0]
		}
	}
	return {
		fetchData,
		cacheFirst,
		getStudent,
		getTutorGroup,
		subscribe: store.subscribe
	}
}

export const course_list_store = create_store()