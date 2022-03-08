<script>
	import Icon from '$lib/ui/icon.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Reader from './puzzle-reader.svelte'
	import {domain} from "./puzzle-reader-constant";
	import Panzoom from '@panzoom/panzoom'
	import {setContext, getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {pdf_keyboard_listener_active} from "../../store";

	export let pages_info_2 = []
	export let pdf_array = []
	export let youtube_link_obj = []
	export let close_modal_button_visible = false

	pages_info_2 = pages_info_2.sort((a,b) => a.file_page_num > b.file_page_num ? 1: -1)
	$: nav_thumbs = pages_info_2.map(p => `${domain}/${p.file_name}_${p.file_page_num}_thumb.jpg`)

	let index = 0
	$: current_page = pages_info_2[index]
	$: total_page = pages_info_2.length

	import {onMount} from 'svelte'
	let menu_visible = false
	let panzoom
	let main_stage_el
	let zoom_scale = 1
	const max_zoom_scale = 3
	let fullscreen_el
	let is_fullscreen

	$: is_first = index === 0
	$: is_last = index === pages_info_2.length - 1
	$: can_zoom_in = zoom_scale < max_zoom_scale
	$: can_zoom_out = zoom_scale > 1

	const resetPanZoom = () => {
		zoom_scale = 1
		panzoom.pan(0, 0);
		panzoom.zoom(zoom_scale, {animate: false})
	}

	const onLeftClick = () => {
		resetPanZoom()
		index = Math.max(index - 1, 0)
	}

	const onRightClick = () => {
		resetPanZoom()
		index = Math.min(index + 1, total_page - 1)
	}

	const onToggleMenu = () => {
		menu_visible = !menu_visible
	}

	const zoomIn = () => {
		zoom_scale +=0.1
		zoom_scale = Math.min(zoom_scale, max_zoom_scale)
		panzoom.zoom(zoom_scale, {animate: true})
	}

	const zoomOut = () => {
		zoom_scale -=0.1
		zoom_scale = Math.max(zoom_scale, 1)
		panzoom.zoom(zoom_scale, {animate: true})
	}

	const onToggleFullScreen = () => {
		resetPanZoom()
		if (!document.fullscreenElement) {
			fullscreen_el.requestFullscreen();
			is_fullscreen = true
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
				is_fullscreen = false
			}
		}
	}

	const onKeydown = (e) => {
		if ($pdf_keyboard_listener_active) {
			const k = e.keyCode
			if (k === 39) {
				onRightClick()
			} else if (k === 37) {
				onLeftClick()
			} else if (k === 38) { // up
				zoomIn()
			} else if (k === 40) {
				zoomOut()
			}
		}
	}

	onMount(() => {
		setTimeout(() => {
			panzoom = Panzoom(main_stage_el)
			main_stage_el.addEventListener('contextmenu', e => {
				e.preventDefault()
			})
		}, 1)
	})

	const goToYoutube = href => {
		window.open(href, '_blank').focus();
	}

	const getImageFile = () => {
		return pdf_array[index]
	}

	setContext('pdf-reader', {
		getImageFile
	})
</script>

<div bind:this={fullscreen_el} class="relative overflow-hidden">
	<div class="w-16 fixed left-4 bottom-4 z-50">
		<div class="bg-white shadow border rounded">
			<button on:click={onToggleFullScreen} class="w-full h-16 flex items-center justify-center border-gray-300 border-b hover:bg-gray-100 hover:text-blue-500 focus:outline-none">
				<Icon name="{!is_fullscreen ? 'expand' : 'collapse'}" className="w-8 text-gray-500"/>
			</button>
			<div class="flex grid grid-cols-2">
				<button on:click={zoomIn} class="h-8 flex items-center justify-center hover:bg-gray-100 hover:text-blue-500 focus:outline-none" class:opacity-30={!can_zoom_in}>
					<Icon name="zoom-in" className="w-4 text-gray-500"/>
				</button>
				<button on:click={zoomOut} class="h-8 flex items-center justify-center border-l border-gray-300 hover:bg-gray-100 hover:text-blue-500 focus:outline-none" class:opacity-30={!can_zoom_out}>
					<Icon name="zoom-out" className="w-4 text-gray-500"/>
				</button>
			</div>
			<button on:click={onToggleMenu} class="w-full h-10 flex justify-center items-center border-t border-gray-300 hover:bg-gray-100 hover:text-blue-500 focus:outline-none">
				<Icon name="list" className="w-4 text-gray-500"/>
			</button>
			<div class="h-4 flex justify-center items-center border-t border-gray-300 text-xs text-gray-500">
				{index + 1} / {total_page}
			</div>
			{#if youtube_link_obj.length}
				<Dropdown
								placement="top"
								activator_style="w-full flex justify-center border-t border-gray-300 py-1">
					<div slot="activator" class="relative w-full flex justify-center">
						<Icon name="music" className="w-4"/>
						<div class="bg-gray-100 rounded-full cc w-4 h-4 absolute right-1 text-gray-500 border border-gray-300" style="font-size: 10px; margin-top: 1px">{youtube_link_obj.length}</div>
					</div>
					<div class="dropdown w-72 transform translate-y-8">
						{#each youtube_link_obj as obj}
							<button on:click={() => {goToYoutube(obj.link)}} target="_blank"
							        class="item flex items-center">
								<Icon name="music" className="w-4"/>
								<span class="ml-2">{obj.name || 'Go to youtube'}</span>
							</button>
						{/each}
					</div>
				</Dropdown>
			{/if}
		</div>
	</div>


	<div>
		<button on:click={onLeftClick} class:opacity-30={is_first} class="z-50 flex items-center justify-center hover:bg-gray-500 hover:text-white w-12 h-12 bg-white rounded-full border border-gray-300 fixed top-1/2 left-4 transform -translate-y-1/2">
			<Icon name="right" className="transform rotate-180 w-6"/>
		</button>
		<button on:click={onRightClick} class:opacity-30={is_last} class="z-50 flex items-center justify-center hover:bg-gray-500 hover:text-white w-12 h-12 bg-white rounded-full border border-gray-300 fixed top-1/2 right-4 transform -translate-y-1/2">
			<Icon name="right" className="w-6"/>
		</button>

		{#if close_modal_button_visible}
			<button on:click={closeModal} class="z-50 fixed right-4 top-4 w-14 h-14 shadow-lg border-4 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 bg-white rounded-full cc">
				<Icon name="close" className="w-4"/>
			</button>
		{/if}
		<div class="fixed inset-0" bind:this={main_stage_el}>
			<Reader width={current_page.width} height={current_page.height} file_page_number={current_page.file_page_num} file_name={current_page.file_name}/>
		</div>
	</div>

	<div class="bg-white px-8 fixed inset-x-0 bottom-0 transform transition-transform" class:translate-y-full={!menu_visible}>
		<div class="overflow-x-scroll text-center">
			<div class="inline-flex py-4" style="height: 140px">
				{#each nav_thumbs as src, i}
					<img on:click={() => {index = i}}
					     class="{i === index ? 'opacity-100 border-4 border-black' : 'opacity-40'} h-full mx-2 rounded flex cursor-pointer"
					     {src} alt="thumb">
				{/each}
			</div>
		</div>
	</div>

	<slot/>
</div>

<svelte:window on:keydown={onKeydown}/>