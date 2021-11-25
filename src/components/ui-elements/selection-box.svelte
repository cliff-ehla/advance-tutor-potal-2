<script>
	import {createEventDispatcher} from 'svelte'
	import Dropdown from './dropdown3.svelte'
	export let options
	export let selected_value
	export let caveat_visible = true
	export let dropdown_class = undefined
	export let placeholder = 'Select an option'
	export let value_key = 'value'
	export let label_key = 'label'
	export let image_key = 'image'
	export let disabled = false
	const dispatch = createEventDispatcher()
	$: selected_option = Array.isArray(options) ? options.find(opt => opt[value_key] == selected_value) : null
	$: selected_label = selected_option ? selected_option[label_key] : null
	const scrollTo = (node, v) => {
		if (v == selected_option) {
			node.scrollIntoView()
		}
	}
	const onOptionClick = (value) => {
		if (disabled) return
		dispatch('input', value)
	}
</script>

<Dropdown {caveat_visible} width_class={dropdown_class} {disabled}>
	<div slot="activator" class="flex items-center whitespace-nowrap" class:opacity-40={!selected_label} class:cursor-not-allowed={disabled}>
		{#if selected_label}
			{#if selected_option[image_key]}
				<img src={selected_option[image_key]} alt="hi" class="w-8 h-8 rounded-full mr-2 flex-shrink-0">
			{/if}
			<div class="leading-none">{selected_label}</div>
		{:else}
			{placeholder}
		{/if}
	</div>
	<div class="p-2 bg-white shadow-lg rounded max-h-80">
		{#if options.length}
			{#each options as opt}
				<div use:scrollTo={opt} on:click={onOptionClick(opt[value_key])} class="{opt == selected_option ? 'bg-gray-200 text-blue-500' : ''} h-12 flex items-center px-4 cursor-pointer hover:bg-gray-100 mb-1">
					{#if opt[image_key]}
						<img src={opt[image_key]} alt="hi" class="w-8 h-8 rounded-full mr-2 flex-shrink-0">
					{/if}
					<div class="leading-none">{opt[label_key]}</div>
				</div>
			{/each}
		{:else}
			<p class="p-4 text-gray-400">No options</p>
		{/if}
	</div>
</Dropdown>
