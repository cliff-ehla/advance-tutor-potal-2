<script>
	import {opened_dropdown_id} from "../../store/dropdown-store";
	import Icon from './icon.svelte'

	const dropdown_id = Math.random()
	$: opened = $opened_dropdown_id === dropdown_id

	import {createEventDispatcher} from 'svelte'
	export let options
	export let value
	export let placeholder
	const dispatch = createEventDispatcher()

	const focusMe = node => node.focus()
</script>

<div class="relative w-full">
	<div on:click|stopPropagation={() => opened_dropdown_id.set(dropdown_id)}
	     class="hover:border-blue-500 w-full border-b border-gray-300 py-2 cursor-pointer h-10 inline-flex items-center">
		<input use:focusMe on:input={(e) => {dispatch('input', e.target.value)}} {value} {placeholder}
		       class="focus:outline-none w-full bg-transparent text-t2"/>
		<Icon name="right" className="w-2 transform transition-transform ml-2 {opened ? '-rotate-90' : 'rotate-90'}"/>
	</div>
	{#if opened}
		<div class="absolute z-50 top-10 -left-2 w-56 overflow-y-scroll shadow-lg rounded border border-gray-100 bg-white">
			{#each options as opt}
				<div on:click={() => {dispatch('input', opt)} } class="h-8 flex items-center px-4 cursor-pointer hover:bg-gray-100 mb-1">
					<div class="leading-none">{opt}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<svelte:window on:click={() => {opened_dropdown_id.set(null)}}/>