<script context="module">
	export const load = async ({session}) => {
		if (!session.user_info) {
			return {
				status: 302,
				redirect: '/login'
			}
		} else {
			return {
				status: 302,
				redirect: '/zoom'
			}
		}
	}
</script>