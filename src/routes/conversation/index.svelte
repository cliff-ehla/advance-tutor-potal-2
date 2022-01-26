<script context="module">
	import {course_list_store} from "$lib/store/course_list_store.js";
	import {get} from "svelte/store";

	export const load = () => {
		let list = get(course_list_store).one_on_one
		let first_tg = list ? list[0] : undefined
		let id = first_tg ? first_tg.id : undefined
		if (id) {
			return {
				status: 302,
				redirect: `/conversation/${id}`
			}
		}
		return true
	}
</script>

<p class="note p-4">Conversation not found</p>