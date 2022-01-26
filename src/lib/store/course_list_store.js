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
	return {
		fetchData,
		cacheFirst,
		subscribe: store.subscribe
	}
}

export const course_list_store = create_store()