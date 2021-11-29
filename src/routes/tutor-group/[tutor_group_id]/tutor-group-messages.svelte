<script>
	import MessageView from '../../../components/message/message-view.svelte'
	import {fetchMessage} from "../../../api/message-api";
	import GroupClassTopBar from '../../../components/tutor-group/group-class-top-bar.svelte'
	import {tutor_group_store} from "../../../store";
	import {stores} from "$app/stores"
	const {session, page} = stores()

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: students = tutor_group && tutor_group.students

	let messages
	let selected_student
	let loading = false

	const onStudentClick = async (s) => {
		loading = true
		let msg = await fetchMessage({
			tutor_group_id: $page.params.tutor_group_id,
			student_id: s.id
		}, fetch)
		messages = msg
		selected_student = s
		loading = false
	}
</script>

<GroupClassTopBar segment="tutor-group-messages" {tutor_group}/>

<div class="p-6">
	<p class="pb-4 font-bold text-t2">Messages</p>
	<div class="flex">
		<div class="w-64 overflow-scroll border-gray-300 bg-white rounded border border-gray-200" style="height: calc(100vh - 160px)">
			{#if students}
				{#each students as s}
					<div on:click={() => {onStudentClick(s)}} class="cursor-pointer flex items-center mb-1 p-4 hover:bg-gray-200" class:bg-blue-100={selected_student === s}>
						<img src={s.avatar_filepath} class="w-10 h-10 rounded-full"/>
						<p class="ml-2 font-bold">{s.username}</p>
					</div>
				{/each}
			{:else}
				<div class="p-4">
					No students
				</div>
			{/if}
		</div>
		<div class="flex-1 overflow-scroll ml-4 bg-white" style="height: calc(100vh - 160px)">
			<div class="border border-gray-300 rounded h-full flex flex-col">
				<p class="p-4 bg-gray-200 font-bold text-t1">
					{#if selected_student}
						{selected_student.username}
					{/if}
				</p>
				<div class="p-4 flex-1">
					{#if loading}
						<div class="p-4">Loading...</div>
					{:else if !selected_student}
						<div class="p-4">Select a conversation</div>
					{:else}
						<MessageView {messages}/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>