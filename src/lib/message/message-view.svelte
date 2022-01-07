<script>
	export let messages
	export let teacher_id

	import Icon from '$lib/ui/icon.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import dayjs from "dayjs";
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()
	import LightRoom from '$lib/ui/light-room.svelte'
	import {getContext} from 'svelte'
	const {open} = getContext('simple-modal')
	import {pdf_keyboard_listener_active} from "../../store";

	const onDelete = (id) => {
		dispatch('delete', id)
	}

	const onImageClick = (img) => {
		pdf_keyboard_listener_active.set(false)
		open(LightRoom, {
			file_paths: [img],
			idx: 0,
			no_backdrop: true,
			onClose: () => {
				pdf_keyboard_listener_active.set(true)
			}
		})
	}
</script>

{#if messages && messages.length}
	{#each messages as m}
		<div class="mb-4">
			<div class="text-center text-gray-400 text-xs mb-4">{dayjs(m.create_ts).format('DD MMM, H:mma')}</div>
			<div class="flex">
				<div class="w-8 h-8 rounded-full bg-center bg-cover flex-shrink-0" style="background-image: url({m.avatar_filepath})"></div>
				<div class="ml-2">
					<p class="text-xs text-gray-400">{m.username}</p>
					{#if m.message}
						<div class="bg-blue-500 text-white px-2 py-1 rounded text-sm relative group">
							{#if teacher_id === m.user_id}
								<div class="absolute right-1 top-1 opacity-0 group-hover:opacity-100">
									<Dropdown activator_style="bg-black bg-opacity-60 rounded-full w-4 h-4 flex items-center justify-center" activator_active_style="bg-white text-gray-700">
										<div slot="activator">
											<Icon name="more" className="w-3"/>
										</div>
										<div class="bg-white shadow-lg w-32">
											<div on:click={() => {onDelete(m.message_id)}} class="cursor-pointer px-4 py-2 text-gray-500 hover:text-red-500">
												Delete
											</div>
										</div>
									</Dropdown>
								</div>
							{/if}
							{m.message}
						</div>
					{:else if m.image_url}
						<img on:click={() => {onImageClick(m.image_url)}} src={m.image_url} class="w-40 cursor-pointer" alt="img">
					{:else if m.audio_url}
						<div class="bg-blue-500 text-white p-2 rounded">
							<audio src={m.audio_url} controls></audio>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/each}
{:else}
	<p class="text-gray-500 text-sm p-4">No message</p>
{/if}