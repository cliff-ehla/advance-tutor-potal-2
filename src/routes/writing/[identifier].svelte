<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const identifier = page.params.identifier
		const {data, success, debug} = await http.get(fetch, `/writingApi/get_user_writing?identifier=${identifier}`)
		const {para, edit_log, comments, title, writing_id} = data
		return {
			props: {
				para, edit_log, comments, title, writing_id
			}
		}
	}
</script>

<script>
	export let para
	export let edit_log
	export let comments
	export let title
	export let writing_id
	import Writing from '$lib/writing/index.svelte'
	
	console.log('cliff: ', para, edit_log, comments, title, writing_id)
</script>

<div class="p-4">
	<h1 class="page-title mb-4">{title}</h1>
	<Writing {para} {edit_log} {comments} {title} {writing_id}/>
</div>