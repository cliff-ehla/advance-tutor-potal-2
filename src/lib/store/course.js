import {writable} from "svelte/store";
import {http} from "$lib/http.js";

const create_store = () => {
	const store = writable({})
	const object = {
		zoom_list: [],
		message: [],
		reminder: []
	}
	const fetchZoomList = async (fetch, {tutor_group_id}) => {
		const {data} = await http.post(fetch, '/zoomApi/zoom_list', {
			tutor_group_id
		})
		store.update(v => ({
			...v,
			[tutor_group_id]: data
		}))
		return data
	}
	return {
		fetchZoomList,
		subscribe: store.subscribe
	}
}

export const course_store = create_store()