<script>
	import {listAlertMessage, fetchMessage, sendAlertMessage, deleteMessage} from "../../api/message-api";
	import {onMount} from 'svelte'
	import MessageView from './message-view.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import ConfirmSendMessage from "./confirm-send-message.svelte";
	import {getContext} from 'svelte'
	const {open} = getContext('simple-modal')
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()

	export let tutor_group_id
	export let student_id
	export let teacher_id
	export let crazy_fetch = true
	export let height = '600px'

	let messages
	let updating_message
	let scroll_container_el
	let last_message_id
	let is_message_unread
	let alert_message_options

	$: {
		if (tutor_group_id) updateMessage()
	}

	onMount(() => {
		let id
		if (crazy_fetch) id = setInterval(updateMessage, 10000)
		getAlertMessage()
		initMessageAndScrollToBottom()
		return () => {
			if (id) clearInterval(id)
		}
	})

	const initMessageAndScrollToBottom = async () => {
		await updateMessage()
		scrollToBottom()
	}

	const getAlertMessage = async () => {
		alert_message_options = await listAlertMessage(fetch)
	}

	const updateMessage = async () => {
		console.log('updateMessage')
		updating_message = true
		messages = await fetchMessage({
			tutor_group_id,
			student_id,
		}, fetch)
		let _last_message_id = messages.length && messages[messages.length - 1].message_id
		if (scroll_container_el) {
			if (_last_message_id && (_last_message_id !== last_message_id)) {
				setTimeout(() => {
					is_message_unread = true
					dispatch('unread')
				}, 10)
			}
			last_message_id = _last_message_id
		}
		updating_message = false
	}

	const onSendMessage = async (message) => {
		open(ConfirmSendMessage, {
			message: message.description,
			onConfirm: async () => {
				await sendAlertMessage({
					tutor_group_id,
					teacher_id,
					message_id: message.id
				}, fetch)
				await updateMessage()
				scrollToBottom()
			}
		})
	}

	const handleScroll = node => {
		scroll_container_el = node
		const onScroll = e => {
			if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight - 20) {
				is_message_unread = false
				dispatch('read')
			}
		}
		node.addEventListener('scroll', onScroll)
		return {
			destroy() {
				node.removeEventListener('scroll', onScroll)
				scroll_container_el = null
			}
		}
	}

	const onDelete = async e => {
		const message_id = e.detail
		await deleteMessage({
			message_id
		})
		updateMessage()
	}

	export function scrollToBottom () {
		setTimeout(() => {
			if (!scroll_container_el) return
			scroll_container_el.scrollTop = scroll_container_el.scrollHeight
		}, 10)
	}
</script>

<div>
	<div style="height: {height}" use:handleScroll bind:this={scroll_container_el} class="overflow-y-scroll px-2 pt-2">
		<MessageView on:delete={onDelete} {messages} {teacher_id}/>
	</div>

	<div class="pt-1 pb-1 px-2 border-gray-200 border-t">
		{#if alert_message_options}
			<Dropdown full_width placement="top-start" offset="4" open_on_hover={false} caveat_visible activator_style="py-2 px-4 bg-blue-500 rounded w-full text-white w-full" activator_active_style="bg-blue-700">
				<button slot="activator" class="w-full">Quick message</button>
				<div class="bg-white shadow-lg w-72 overflow-scroll" style="max-height: 400px;">
					{#each alert_message_options as m}
						<div on:click={() => {onSendMessage(m)}} class="cursor-pointer hover:bg-gray-100 hover:text-blue-500 px-4 py-2 border-b border-gray-200">{m.description}</div>
					{/each}
				</div>
			</Dropdown>
		{/if}
	</div>
</div>