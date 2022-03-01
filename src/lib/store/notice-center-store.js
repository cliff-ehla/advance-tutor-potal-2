import {get, derived, writable} from "svelte/store";
import {http} from "$lib/http.js";

const create_store = () => {
	const store = writable({
		unread_count: 0,
		message_list: [],
		notice_list: []
	})
	const d_store = derived(store, $store => {
		const master_list = [...$store.message_list, ...$store.notice_list]
		master_list.sort((a,b) => {
			return a.create_ts > b.create_ts ? -1 : 1
		})
		return {
			master_list,
			...$store
		}
	})
	const fetchNoticeAndMessage = (fetch) => {
		fetchMessage(fetch)
		return fetchNotice(fetch)
	}
	const fetchUnreadCount = async (fetch) => {
		try {
			const {data, success, debug} = await http.get(fetch, '/tutorApi/list_unread_message_and_notice')
			if (success) {
				const {message_cnt, notice_cnt} = data
				store.update(v => ({
					...v,
					unread_count: message_cnt + notice_cnt
				}))
			}
			return {data, success, debug}
		} catch (e) {
			console.log(e)
		}
	}
	const fetchMessage = async (fetch) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_message', {
			is_new: true
		})
		if (success) {
			store.update(v => ({
				...v,
				message_list: data
			}))
		}
		return {data, success, debug}
	}
	const fetchNotice = async (fetch) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_notice', {
			is_new: true
		})
		if (success) {
			store.update(v => ({
				...v,
				notice_list: data
			}))
		}
		return {data, success, debug}
	}
	return {
		fetchUnreadCount,
		fetchMessage,
		fetchNotice,
		fetchNoticeAndMessage,
		subscribe: d_store.subscribe
	}
}

export const noticeCenterStore = create_store()