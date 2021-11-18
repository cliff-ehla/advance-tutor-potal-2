<script context="module">
	import {http} from "$lib/http";

	export const load = async ({fetch}) => {
		await http.post(fetch, '/user/logout', {})
		return {
			redirect: '/login',
			status: 302
		}
	}
</script>