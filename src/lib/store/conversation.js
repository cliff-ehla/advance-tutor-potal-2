import {get, writable} from "svelte/store";
import {http} from "$lib/http.js";

const create_store = () => {
	const store = writable([])
	const fetchConversation = async (fetch) => {
		const {data, success, debug} = await http.get(fetch, '/tutorApi/list_conversation')
		store.set(data)
		return {data, success, debug}
	}
	const getConversation = (id) => {
		return get(store).find(c => c.tutor_group_id === id)
	}
	return {
		fetchConversation,
		getConversation,
		subscribe: store.subscribe
	}
}

export const conversation_store = create_store()