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

<div class="h-72 cc text-center">
	<div>
		<p class="page-title mb-4">No conversation found.</p>
		<p class="note">
			You don't have any ongoing 1-on-1 courses.
		</p>
	</div>
</div>