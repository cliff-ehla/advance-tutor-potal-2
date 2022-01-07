<script>
	import Icon from '../../ui-elements/icon.svelte'
	import Reader from './puzzle-reader.svelte'
	// import RatingButton from './rating-button.svelte'
	import StudentWidget from './student-widget.svelte'
	import { debounce } from "debounce";
	import {domain} from "./puzzle-reader-constant";
	import Panzoom from '@panzoom/panzoom'
	// import tippy from "tippy.js";
	import {pdf_keyboard_listener_active} from "../../../store";

	export let pages_info_2 = []
	export let top_offset = 48
	export let youtube_links = []

	// pass to rating button
	export let student_id = undefined
	export let item_id = undefined
	export let teacher_id = undefined
	export let tutor_group_id = undefined

	pages_info_2 = pages_info_2.sort((a,b) => a.file_page_num > b.file_page_num ? 1: -1)
	$: nav_thumbs = pages_info_2.map(p => `${domain}/${p.file_name}_${p.file_page_num}_thumb.jpg`)

	let index = 0
	$: current_page = pages_info_2[index]
	$: total_page = pages_info_2.length

	import {onMount} from 'svelte'
	let body_height
	let menu_height = 120
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
	$: computed_body_height = body_height + menu_height
	$: computed_body_padding = menu_visible ? menu_height : 0

	const setDimension = () => {
		body_height = window.innerHeight - top_offset - menu_height
	}

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
		const dHandler = debounce(setDimension, 100)
		setDimension()
		setTimeout(() => {
			panzoom = Panzoom(main_stage_el)
			main_stage_el.addEventListener('contextmenu', e => {
				e.preventDefault()
			})
		}, 1)
		window.addEventListener('resize', dHandler)
		return () => {
			window.removeEventListener('resize', dHandler)
		}
	})

	const goToYoutube = href => {
		window.open(href, '_blank').focus();
	}

	const tooltip = (node, is_fullscreen) => {
		const showTooltip = (is_fullscreen) => {
			// tippy(node, {
			// 	content: !is_fullscreen ? 'Fullscreen' : `Collapse`,
			// 	placement: 'right'
			// })
		}
		showTooltip(is_fullscreen)
		return {
			update: showTooltip
		}
	}
</script>

<div bind:this={fullscreen_el} class="relative overflow-hidden">

	{#if student_id && tutor_group_id}
		<div class="fixed right-8 bottom-0 z-50">
			<StudentWidget {student_id} {tutor_group_id} {teacher_id}/>
		</div>
	{/if}

	<div class="w-16 fixed left-4 bottom-4 z-50">
		{#if student_id && tutor_group_id}
			<div class="mb-2">
<!--				<RatingButton {student_id} {item_id}/>-->
			</div>
		{/if}
		<div class="bg-white shadow border rounded">
			<button use:tooltip={is_fullscreen} on:click={onToggleFullScreen} class="w-full h-16 flex items-center justify-center border-gray-300 border-b hover:bg-gray-100 hover:text-blue-500 focus:outline-none">
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
			{#if youtube_links.length}
				<div class="flex justify-center border-gray-300 border-t">
					{#each youtube_links as href}
						<button on:click={() => {goToYoutube(href)}} target="_blank"
						   class="bg-white text-black w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:text-blue-500">
							<Icon name="music" className="w-4"/>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>


	<div class="bg-gray-100" style="height: {computed_body_height}px; padding-bottom: {computed_body_padding}px">
		<button on:click={onLeftClick} class:opacity-30={is_first} class="z-50 flex items-center justify-center hover:bg-gray-500 hover:text-white w-12 h-12 bg-white rounded-full border border-gray-300 absolute top-1/2 left-4 transform -translate-y-1/2">
			<Icon name="right" className="transform rotate-180 w-6"/>
		</button>
		<button on:click={onRightClick} class:opacity-30={is_last} class="z-50 flex items-center justify-center hover:bg-gray-500 hover:text-white w-12 h-12 bg-white rounded-full border border-gray-300 absolute top-1/2 right-4 transform -translate-y-1/2">
			<Icon name="right" className="w-6"/>
		</button>

		{#if body_height}
			<div class="w-full h-full" bind:this={main_stage_el}>
				<Reader width={current_page.width} height={current_page.height} file_page_number={current_page.file_page_num} file_name={current_page.file_name}/>
			</div>
		{/if}
	</div>

	<div class="bg-white px-8 absolute inset-x-0 bottom-0 transform transition-transform" class:translate-y-full={!menu_visible}>
		<div class="overflow-x-scroll text-center">
			<div class="inline-flex py-4" style="height: {menu_height}px">
				{#each nav_thumbs as src, i}
					<img on:click={() => {index = i}}
					     class="{i === index ? 'opacity-100 border-4 border-black' : 'opacity-40'} h-full mx-2 rounded flex cursor-pointer"
					     {src} alt="thumb">
				{/each}
			</div>
		</div>
	</div>
</div>

<svelte:window on:keydown={onKeydown}/>