<script>
	import {createEventDispatcher} from 'svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Icon from '$lib/ui/icon.svelte'
	const dispatch = createEventDispatcher()

	export let value
	export let options = []
	export let label_key = 'comment_msg'
	let placeholder = 'Type something here...'

	const onSelect = (option) => {
		value = option[label_key]
		dispatch('input', value)
	}

	const onInput = (e) => {
		dispatch('input', e.target.value)
	}

	const type_to_label = {
		good: 'Good comment',
		improve: 'For improvement',
		weakness: 'Poor comment',
	}
</script>

<div class="relative border border-gray-300 rounded bg-white">
	<div class="absolute right-2 top-2">
		<Dropdown placement="bottom-end"
		          activator_active_style="bg-blue-200"
		          activator_style="w-12 h-12 rounded-full flex items-center justify-center shadow bg-blue-100 text-blue-500">
			<button slot="activator">
				<Icon name="add" className="fill-current w-4"/>
			</button>
			<div class="bg-white rounded border border-gray-300 shadow-lg max-h-80 w-96 overflow-y-scroll">
				{#each options as option}
					<div on:click={() => {onSelect(option)}} class="px-4 py-2 hover:bg-gray-100 hover:text-blue-500 cursor-pointer border-b border-gray-300">
						{#if option.comment_subtype}
							<p class="text-xs font-bold border-b-2 border-current inline-block">
								{type_to_label[option.comment_subtype]}
							</p>
						{/if}
						<p>{option[label_key]}</p>
					</div>
				{/each}
			</div>
		</Dropdown>
	</div>
	<textarea id="template-text-box" on:input={onInput} rows="4" {placeholder} class="focus:outline-none p-4 pr-16 rounded w-full" bind:value={value}/>
</div>