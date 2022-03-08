<script>
	import MainEditor from './main-editor.svelte'
	import Popup from './popup.svelte'

	export let para = []
	export let comments = []
	export let edit_log = []
	export let is_readonly = false
	export let text_editor_active = undefined
	export let font_size = 24
</script>

<Popup>
	<MainEditor {font_size} {para} {comments} {edit_log} {is_readonly} {text_editor_active}/>
</Popup>