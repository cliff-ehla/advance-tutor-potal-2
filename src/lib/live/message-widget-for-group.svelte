<script>
	import {onMount} from 'svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import {dialog} from "$lib/store/dialog.js";
	import {createEventDispatcher} from 'svelte'
	import {http} from "$lib/http.js";

	const dispatch = createEventDispatcher()

	export let tutor_group_id
	export let teacher_id
	export let secondary = undefined
	let alert_message_options

	onMount(() => {
		getAlertMessage()
	})

	const getAlertMessage = async () => {
		const {data} = await http.get(fetch, '/messageApi/list_class_alert_message')
		alert_message_options = data
	}

	const onSendMessage = async (message) => {
		dialog.confirm({
			title: message.description,
			onConfirm: () => {
				return http.post(fetch, '/messageApi/send_alert_message', {
					tutor_group_id,
					message_id: message.id
				}, {
					notification: "Message sent"
				})
			}
		})
	}
</script>

<div>
	{#if alert_message_options}
		<Dropdown full_width placement="top-start" offset="4" open_on_hover={false} caveat_visible
		          activator_style="text-xs h-5 items-center flex {secondary ? 'border-blue-300 text-blue-500 border bg-blue-50' : 'bg-blue-500 text-white'} px-2 rounded-sm"
		          activator_active_style="{secondary ? 'border-blue-500' : 'bg-blue-700'}">
			<button slot="activator" class="w-full">Message</button>
			<div class="bg-white shadow-lg w-72 overflow-scroll" style="max-height: 400px;">
				{#each alert_message_options as m}
					<div on:click={() => {onSendMessage(m)}}
					     class="cursor-pointer hover:bg-gray-100 hover:text-blue-500 px-4 py-2 border-b border-gray-200">{m.description}</div>
				{/each}
			</div>
		</Dropdown>
	{/if}
</div>