<script context="module">
	export const load = ({stuff}) => {
		let list = stuff.conversation_list
		let first_tg = list ? list[0] : undefined
		let id = first_tg ? first_tg.tutor_group_id : undefined
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