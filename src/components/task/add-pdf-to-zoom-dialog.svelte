<script>
	import {getTutorGroupItemList} from "../../api/tutor-api";
	import {getItem} from "../../api/item-api";
	import {onMount, getContext} from 'svelte'
	import {addMaterialToZoom} from "../../api/zoom-api";
	import Icon from '../ui-elements/icon.svelte'
	import {tutor_group_store} from "../../store";
	import RatingLabel from '../zoom/rate-label.svelte'

	export let tutor_group_id
	export let wrapper_id
	export let student_id
	export let task_start_date
	export let category
	export let selected_filter
	$: student = $tutor_group_store ? tutor_group_store.getOOO(student_id) : null
	$: is_one_on_one = !!student

	const {close} = getContext('simple-modal')
	const {showNotification} = getContext('notification')

	let items = []
	let history_items = []
	let filters = []
	let loading_save
	let loading_preview
	$: filtered_items = selected_filter === 'History' ? history_items : items.filter(item => item.level === selected_filter)

	let selected_item_id
	let preview_thumbs

	onMount(async () => {
		const data = await getTutorGroupItemList({tutor_group_id, category}, fetch)
		items = data.unselected_items
		history_items = data.selected_items
		filters = data.tag_ordering
		selected_filter = filters[0]
	})

	const onSave = async () => {
		if (loading_save || !selected_item_id) return
		loading_save = true
		await addMaterialToZoom(fetch, {
			item_id: selected_item_id,
			tutor_group_id,
			wrapper_id,
			start_time: task_start_date
		})
		showNotification('Add material success')
		close()
	}

	const onSelectItem = async (item) => {
		loading_preview = true
		selected_item_id = item.id
		let data = await getItem(selected_item_id, fetch)
		preview_thumbs = data.pdf_array
		loading_preview = false
	}

	const onFilterSelect = (f) => {
		preview_thumbs = null
		selected_filter = f
	}
</script>

<div class="flex">
	<div class="w-2/3">
		<div class="h-16 flex items-center px-8 border-b border-gray-300">
			<div class="leading-none">
				{#if student}
					<p class="text-sm mb-0.5">Select material for</p>
					<p class="text-t1 font-bold">{student.nickname} ({student.level})</p>
				{:else}
					<p class="text-t1 font-bold">Select material</p>
				{/if}
			</div>
			<div class="ml-auto">
				<button on:click={() => {onFilterSelect('History')}} class="{selected_filter === 'History' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500 border'} cursor-pointer px-2 py-1 mx-1 rounded whitespace-nowrap">Learning history</button>
			</div>
		</div>
		<div class="h-16 flex text-sm text-gray-300 px-8 border-b border-gray-300 bg-gray-100 items-center overflow-x-scroll">
			{#if filters}
				{#each filters as f}
					<div on:click={() => {onFilterSelect(f)}} class="{selected_filter === f ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500 border'} cursor-pointer px-2 py-1 mx-1 rounded whitespace-nowrap">{f}</div>
				{/each}
			{/if}
		</div>
		<div class="overflow-y-scroll" style="height: calc(70vh - 6em)">
			<div class="grid grid-cols-3 gap-4 px-4 py-8">
				{#if filtered_items.length}
					{#each filtered_items as item}
						<div on:click={() => onSelectItem(item)} class="relative text-center cursor-pointer border border-gray-100 shadow-lg rounded overflow-hidden">
							<div class="{item.id === selected_item_id ? 'bg-blue-500 text-white border-2 border-white' : 'bg-white border-2 border-blue-500'} w-6 h-6 rounded flex items-center justify-center absolute right-2 top-2 shadow-lg">
								{#if item.id === selected_item_id}
									<Icon name="tick" className="w-4"/>
								{/if}
							</div>
							<div class="bg-center bg-cover" style="background-image: url({item.thumbnail_path})">
								<div style="padding-top: 80%"></div>
							</div>
							<div class="text-sm leading-tight py-4 px-2">
								<p>{item.name}</p>
								{#if selected_filter === 'History'}
									{#if item.t_difficulty_rate}
										<div class="mt-2"><RatingLabel rate={item.t_difficulty_rate}/></div>
									{/if}
								{/if}
							</div>
						</div>
					{/each}
				{:else}
					<div class="p-4">No items</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="w-1/3 border-l border-gray-300">
		<div class="h-16 flex items-center text-sm px-8 text-gray-500">Preview</div>
		<div class="overflow-y-scroll px-4" style="height: calc(70vh - 2em)">
			{#if preview_thumbs}
				{#if loading_preview}
					Loading...
				{:else}
					{#each preview_thumbs as src}
						<div class="py-4 px-8">
							<img {src} alt="thumb" class="rounded-sm">
						</div>
					{/each}
				{/if}
			{:else}
				<p class="text-center text-gray-400 text-sm pt-20">Select to preview</p>
			{/if}
		</div>
	</div>
</div>

<div class="h-16 px-8 flex border-t border-gray-300 justify-between items-center">
	<button on:click={() => {close()}} class="rounded border border-gray-300 px-12 flex items-center h-8">Cancel</button>
	<button on:click={onSave} class="rounded {(loading_save || !selected_item_id) ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-white'} px-12 flex items-center h-8">{loading_save ? 'Saving...' : 'Save'}</button>
</div>