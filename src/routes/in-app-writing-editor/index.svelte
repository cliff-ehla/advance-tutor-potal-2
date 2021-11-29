<script>
	import {onMount} from 'svelte'
	import WritingEditor from '../../components/writing/index.svelte'
	import {parseLegacyData} from "../../api/writing-api";
	import {left_bar_visible} from "../../store";
	left_bar_visible.set(false)

	let para, edit_log, comments, is_readonly

	const onSaveEditing = (e) => {
		const message = {
			type: 'update',
			data: e.detail
		}
		window.postMessage(JSON.stringify(message))
	}

	onMount(() => {
		document.addEventListener('message', (e) => {
			const data = JSON.parse(e.data)
			let config = data.data
			let {legacy_data, new_data} = config
			let content = new_data ? new_data : parseLegacyData(legacy_data)
			para = content.para
			edit_log = content.edit_log
			comments = content.comments
			is_readonly = config.is_readonly
		})
	})
</script>

{#if para && para.length}
	<WritingEditor {para} {edit_log} {comments} {is_readonly} on:update={onSaveEditing}/>
{/if}