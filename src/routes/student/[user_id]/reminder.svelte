<script>
	import {tutor_group_store} from "../../../store";
	import {stores} from '$app/stores'
	import TopBar from '../../../components/student-top-bar.svelte'
	const {page, session} = stores()
	import {markAsRead} from "../../../api/student-note-api";
	import {onMount} from 'svelte'
	import NoteWidget from '../../../components/message/note-widget.svelte'

	let student_id = $page.params.user_id
	let tutor_group_id = $page.params.tutor_group_id
	let teacher_id = $session.user_id

	onMount(() => {
		markAsRead({
			student_id: $page.params.user_id
		}, fetch)
	})
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO($page.params.user_id) : null
</script>

{#if o_o_o}
	<TopBar {o_o_o} segment="reminder"/>
{/if}

<div class="p-8">
	<NoteWidget height="calc(100vh - 170px)" {tutor_group_id} {student_id} {teacher_id}/>
</div>

