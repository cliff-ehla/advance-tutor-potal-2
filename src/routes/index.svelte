<script context="module">
	import dayjs from "dayjs";

	export const load = async ({session, fetch}) => {
		if (!session.user_info) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {
			status: 302,
			redirect: `/schedule/${dayjs().format('YYYY-MM-DD')}/month`
		}
	}
</script>