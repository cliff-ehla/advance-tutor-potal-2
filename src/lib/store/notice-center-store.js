import {writable} from "svelte/store";
import {http} from "$lib/http.js";

const create_store = () => {
	const store = writable({
		unread_count: 0,
		message_list: [],
		notice_list: []
	})
	const fetchUnreadCount = async (fetch) => {
		const {data, success, debug} = await http.get(fetch, '/tutorApi/list_unread_message_and_notice')
		if (success) {
			const {message_cnt, notice_cnt} = data
			store.update(v => ({
				...v,
				unread_count: message_cnt + notice_cnt
			}))
		}
		return {data, success, debug}
	}
	return {
		fetchUnreadCount,
		subscribe: store.subscribe
	}
}

export const noticeCenterStore = create_store()