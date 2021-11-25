<script>
	import {createEventDispatcher} from 'svelte'
	import Dropdown from '../ui-elements/dropdown2.svelte'
	import {tutor_group_store} from "../../store";
	import StudentsDisplay from './students-display.svelte'

	export let options = $tutor_group_store.tutor_group_list
	export let selected_value
	export let placeholder = 'Select a tutor group'
	export let disabled = false
	const dispatch = createEventDispatcher()
	$: selected_option = options.find(opt => opt.tutor_group_id == selected_value)
	$: selected_label = selected_option ? selected_option.title : null
	const onOptionClick = (value) => {
		dispatch('input', value)
	}
</script>

<Dropdown {disabled}>
	<div slot="activator" class="flex items-center whitespace-nowrap" class:opacity-40={!selected_label} class:cursor-not-allowed={disabled}>
		{#if selected_label}
			<div>
				<div class="leading-none whitespace-nowrap overflow-ellipsis overflow-hidden mb-2 max-w-sm">{selected_label}</div>
				<StudentsDisplay students={selected_option.students}/>
			</div>
		{:else}
			{placeholder}
		{/if}
	</div>
	{#if options.length}
		{#each options as opt}
			<div on:click={onOptionClick(opt.tutor_group_id)}
			     class="{opt == selected_option ? 'bg-gray-100' : ''} h-16 border-b border-gray-200 flex items-center px-4 cursor-pointer hover:text-blue-500">
				<div class="flex items-center">
					<div class="w-2 h-2 rounded-full flex-shrink-0" style="background: {opt.color}"></div>
					<div class="ml-2">
						<p class="leading-none whitespace-nowrap overflow-ellipsis overflow-hidden mb-2 max-w-sm">{opt.title}</p>
						<StudentsDisplay students={opt.students}/>
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<p class="p-4 text-gray-400">No options</p>
	{/if}
</Dropdown>
