<script context="module">
	export const load = ({session}) => {
		// TODO I cannot delete the access token
		// if (session.access_token) {
		// 	return {
		// 		redirect: '/',
		// 		status: 302
		// 	}
		// }
		return true
	}
</script>

<script>
	import {http} from "$lib/http";
	import {goto} from '$app/navigation'

	const onLogin = async () => {
		try {
			await http.post(fetch, '/user/login', {
				username: 'queeniedevc4',
				password: 'a12345678'
			})
			goto('/profile')
		} catch (e) {

		}
	}
</script>

<button on:click={onLogin}>Login</button>