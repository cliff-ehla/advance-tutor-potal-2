<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_fans')
		if (!success) return onFail(debug)
		return {
			props: {
				student_list: data
			}
		}
	}
</script>

<script>
	export let student_list
</script>

{#each student_list as s}
	<div class="p-4">
		<a href="/students/{s.user_id}">{s.nickname} {s.level} {s.zoom_cnt}</a>
	</div>
{/each}