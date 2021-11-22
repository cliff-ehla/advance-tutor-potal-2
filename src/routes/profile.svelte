<script context="module">
	import {http} from "$lib/http";

	export const load = async ({fetch, page}) => {
		const res = await http.get(fetch, '/user/user_info')
		const {success, data, debug} = res
		if (!success) {
			if (debug.err_code === 401) {
				return {
					status: 302,
					redirect: '/login'
				}
			}
			// TODO how about 500? will it fallback to error page? and sentry?
		}
		return {
			props: {
				user_info: data[0]
			}
		}
	}
</script>

<script>
	export let user_info
</script>

<div class="container">
	<div class="mb-4">
		{#if user_info}
			<p>{user_info.username}</p>
		{/if}
	</div>
	<a class="button" href="/logout">Logout</a>
</div>
