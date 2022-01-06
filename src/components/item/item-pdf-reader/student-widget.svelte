<script>
	export let tutor_group_id
	export let student_id
	export let teacher_id

	import MessageWidget from '$lib/message/message-widget.svelte'
	import NoteWidget from '../../../components/message/note-widget.svelte'
	import Icon from '../../../components/ui-elements/icon.svelte'
	import {getContext} from 'svelte'
	const {open} = getContext('simple-modal')
	import {tutor_group_store} from "../../../store";

	let tabs = ['Message', 'Reminder']
	let selected_tab = tabs[0]
	let is_collapsed = false

	let is_message_unread
	let is_note_unread
	let note_widget_el
	let message_widget_el

	$: student = tutor_group_store.getOOO(student_id)
	$: student_name = student ? student.nickname : ''

	const onTabSelect = t => {
		if (t === 'Reminder') {
			is_note_unread = false
			note_widget_el.markAsReadAndScroll()
		} else {
			is_message_unread = false
			message_widget_el.scrollToBottom()
		}
		selected_tab = t
	}
</script>

<div class="w-72 bg-white shadow-lg border border-gray-300 rounded flex flex-col transition-all {!is_collapsed ? 'h-96' : 'h-12'}">
	<div on:click={() => {is_collapsed = !is_collapsed}} class="cursor-pointer group h-12 flex items-center border-b border-gray-300">
		<div class="flex-1 px-4 flex items-center">
			{#if student}
				<div class="inline-flex relative items-center h-8">
					<div class="w-8 h-8 rounded-full bg-cover" style="background-image: url({student.avatar_filepath})"></div>
					<p class="ml-2">{student_name}</p>
					{#if is_message_unread || is_note_unread}
						<div class="absolute top-0 -right-2 w-2 h-2 rounded-full bg-red-500"></div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
			<button class="focus:outline-none h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-gray-100">
				<Icon name="{is_collapsed ? 'right' : 'close'}" className="w-4 text-gray-500 transform transition-transform {is_collapsed ? 'rotate-90' : '-rotate-90'}"/>
			</button>
		</div>
	</div>

	<div class="flex px-2 py-2 text-sm border-b border-gray-300">
		{#each tabs as t}
			<div class="relative">
				<button on:click={() => {onTabSelect(t)}} class="{t === selected_tab ? 'focus:outline-none bg-gray-100 border border-gray-300' : 'hover:bg-gray-200'} px-2 py-1 mx-0.5 rounded text-blue-500">
					{t}
				</button>
				{#if t === 'Message' && is_message_unread}
					<div class="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-red-500"></div>
				{/if}
				{#if t === 'Reminder' && is_note_unread}
					<div class="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-red-500"></div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="flex-1 p-2 pb-0">
		<div class:hidden={selected_tab !== 'Message'}>
			<MessageWidget on:unread={() => {is_message_unread = true}}
			               on:read={() => {is_message_unread = false}}
			               bind:this={message_widget_el}
			               height="226px" {tutor_group_id} {student_id} {teacher_id}/>
		</div>
		<div class:hidden={selected_tab !== 'Reminder'}>
			<NoteWidget on:unread={() => {is_note_unread = true}}
			            bind:this={note_widget_el} height="226px" {student_id} {teacher_id}/>
		</div>
	</div>

</div>