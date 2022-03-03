<script>
	import Icon from '$lib/ui/icon.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()
	export let value = []
	export let options = []
	let input_value
	let input_el
	let focus_idx = 0
	let is_opened = false
	$: value_ids = value.map(v => v.id)
	$: filtered_options = input_value ? options.filter(opt => {
		const label = opt.comment_subtype
		const msg = opt.comment_msg.toLowerCase()
		const v = input_value.toLowerCase()
		return label.includes(v) || msg.includes(v)
	}) : options
	const onToggle = (obj) => {
		if (value_ids.includes(obj.id)) {
			value.splice(value.indexOf(obj), 1)
		} else {
			value.push(obj)
		}
		value = value
		input_value = ''
		focus_idx = 0
		console.log('dispatch input', value)
		dispatch('input',value)
	}
	const type_to_color = {
		good: 'bg-green-500',
		improve: 'bg-yellow-500',
		weakness: 'bg-red-500',
	}
	const type_to_label = {
		good: 'Good comment',
		improve: 'For improvement',
		weakness: 'Weak area',
	}

	const onkeydown = (e) => {
		const code = e.keyCode
		if (!is_opened) {
			if (document.activeElement === input_el && ![9,16].includes(code)) { // shift, tab
				is_opened = true
			}
		} else {
			let max = filtered_options.length - 1
			if (code === 38) { // up
				focus_idx--
				if (focus_idx < 0) focus_idx = 0
			} else if (code === 40) { // down
				focus_idx++
				if (focus_idx > max) focus_idx = max
			} else if (code === 13) { // enter
				onToggle(filtered_options[focus_idx])
				is_opened = false
			} else if (code === 27) { // esc
				is_opened = false
			}
		}
	}
</script>

<svelte:window on:keydown={onkeydown}/>

<div class="border border-gray-300 rounded bg-white p-2">
	<div>
		{#each value as v}
			<div class="bg-gray-200 rounded-sm mb-1 flex items-center overflow-hidden pl-2">
				<div class="label {type_to_color[v.comment_subtype]}">
					{type_to_label[v.comment_subtype]}
				</div>
				<div class="px-2 flex-1 text-sm leading-tight">{v.comment_msg}</div>
				<div on:click={() => {onToggle(v)}} class="w-8 h-8 cursor-pointer flex items-center justify-center hover:text-red-500">
					<Icon name="close" className="w-2"/>
				</div>
			</div>
		{/each}
	</div>
	<Dropdown
					on:input={e => {is_opened = e.detail}}
					opened={is_opened}
					classname="absolute rounded py-2 shadow-lg left-0 bg-white border border-gray-300 w-full z-50 overflow-y-scroll max-h-80">
		<div slot="activator" class="flex h-8 items-center">
			<div class="mx-2 text-gray-400">
				<Icon name="search" className="w-4"/>
			</div>
			<input bind:this={input_el} bind:value={input_value} type="text" class="h-full text-sm w-full mx-2 px-2 outline-none" placeholder="Search...">
			<div class="mx-2">
				<Icon name="right" className="w-3 transform rotate-90"/>
			</div>
		</div>
		<div class="p-2">
			{#each filtered_options as opt, i}
				<div class:bg-gray-200={focus_idx === i} on:click={() => {onToggle(opt)}} class="cursor-pointer px-2 py-2 hover:bg-gray-200 flex items-center">
					<div class="{type_to_color[opt.comment_subtype]} label">{type_to_label[opt.comment_subtype]}</div>
					<p class="mx-2 text-sm leading-tight flex-1">{opt.comment_msg}</p>
					<div class="{value_ids.includes(opt.id) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'} w-4 h-4 flex items-center justify-center border border-gray-300 rounded-sm shadow-inner">
						<Icon name="tick" className="w-2"/>
					</div>
				</div>
			{/each}
		</div>
	</Dropdown>
</div>

<style>
	.label {
		@apply text-xs font-bold text-white px-2 py-1 rounded-sm;
	}
</style>