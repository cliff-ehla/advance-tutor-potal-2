<script context="module">
	import {fetchCourseNote, setCourseNote} from "../../../api/course-api";

	export async function load ({page, fetch}) {
		let data = await fetchCourseNote({
			tutor_group_id: page.params.tutor_group_id
		}, fetch)
		return {
			props: {
				note: data.message
			}
		}
	}
</script>

<script>
	import {tutor_group_store} from "../../../store";
	import {stores} from '$app/stores'
	import TopBar from '../../../components/tutor-group/group-class-top-bar.svelte'
	import TextEditor from '../../../components/notepad/index.svelte'
	const {page} = stores()
	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}

	export let note
	console.log(note)
</script>

{#if tutor_group}
	<TopBar {tutor_group} segment="reminder"/>
{/if}

<div class="p-8">
	<TextEditor {note} tutor_group_id={$page.params.tutor_group_id}/>
</div>

