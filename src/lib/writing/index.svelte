<script>
	import MainEditor from './main-editor.svelte'
	import Popup from './popup.svelte'

	export let para = []
	export let comments = []
	export let edit_log = []
	export let is_readonly = false
	export let text_editor_active = undefined
</script>

<Popup>
	<MainEditor {para} {comments} {edit_log} {is_readonly} {text_editor_active}/>
</Popup>