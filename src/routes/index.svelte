<script context="module">
	export const load = async ({session, fetch}) => {
		if (!session.user_info) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {
			status: 302,
			redirect: '/schedule'
		}
	}
</script>