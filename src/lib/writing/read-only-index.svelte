<script>
	import {http} from "$lib/http.js";

	export let identifier
	import {onMount} from "svelte";
	import Writing from '$lib/writing/index.svelte'

	let para, edit_log, comments, title, writing_id

	onMount(async () => {
		const {data, success, debug} = await http.get(fetch, `/writingApi/get_user_writing?identifier=${identifier}`)
		para = data.para
		edit_log = data.edit_log
		comments = data.comments
		title = data.title
		writing_id = data.writing_id
	})
</script>

{#if para}
	<Writing {para} {edit_log} {comments} {title} {writing_id}/>
{/if}