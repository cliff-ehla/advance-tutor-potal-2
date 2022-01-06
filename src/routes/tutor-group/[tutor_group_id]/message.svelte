<script>
	import TopBar from '../../../components/student-top-bar.svelte'
	import SideTab from './_side-tab.svelte'
	import {tutor_group_store} from "../../../store";
	import MessageWidget from '$lib/message/message-widget.svelte'
	import {stores} from '$app/stores'
	const {page, session} = stores()

	let student_id = $page.query.get("user_id")
	let teacher_id = $session.user_id
	let tutor_group_id = $page.params.tutor_group_id

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: user_id = $page.query.get("user_id")
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO(user_id) : null

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id]

	let el
</script>

{#if o_o_o}
	<TopBar {o_o_o} segment="course"/>
{/if}

<SideTab {user_id} tutor_group_id={$page.params.tutor_group_id} active_tab="message">
	<div class="px-4 pt-4">
		<MessageWidget bind:this={el} on:unread={() => {el.scrollToBottom()}} {tutor_group_id} {student_id} {teacher_id} height="calc(100vh - 170px)"/>
	</div>
</SideTab>