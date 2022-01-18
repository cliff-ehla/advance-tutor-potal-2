<script>
	export let file_paths
	export let idx
	export let no_backdrop = false
	export let onClose = () => {}

	import Icon from './icon.svelte'
	import {debounce} from 'debounce'
	import {fade} from 'svelte/transition'
	import {createEventDispatcher} from 'svelte'
	import {isPdf} from "$lib/helper/is-pdf";
	import Panzoom from '@panzoom/panzoom'
	import {getContext} from 'svelte'
	const {close} = getContext('simple-modal')

	const dispatch = createEventDispatcher()

	$: total_page = file_paths.length
	$: is_single_image = total_page === 1

	let panzoom
	let staged_img_el
	const max_zoom_scale = 3
	let zoom_scale = 1
	$: src = file_paths[idx]
	$: is_first = idx === 0
	$: is_last = idx === file_paths.length - 1
	$: can_zoom_in = zoom_scale < max_zoom_scale
	$: can_zoom_out = zoom_scale > 1

	const setDimension = () => {
		const el = staged_img_el
		const ratio = el.naturalWidth / el.naturalHeight
		const w1 = window.innerWidth * 0.85
		const w2 = window.innerHeight * 0.85 * ratio
		const w = Math.min(w1, w2)
		el.style.width = w + 'px'
	}

	const onLoad = () => {
		setDimension()
		panzoom = Panzoom(staged_img_el)
	}

	const zoomIn = () => {
		zoom_scale += 0.2
		zoom_scale = Math.min(zoom_scale, max_zoom_scale)
		panzoom.zoom(zoom_scale, {animate: true})
	}

	const zoomOut = () => {
		zoom_scale -= 0.2
		zoom_scale = Math.max(zoom_scale, 1)
		panzoom.zoom(zoom_scale, {animate: true})
	}

	const onLeftClick = () => {
		idx = Math.max(idx - 1, 0)
	}

	const onRightClick = () => {
		idx = Math.min(idx + 1, total_page - 1)
	}

	const onKeydown = (e) => {
		const k = e.keyCode
		e.preventDefault()
		e.stopPropagation()
		if (k === 39) {
			onRightClick()
		} else if (k === 37) {
			onLeftClick()
		} else if (k === 27) {
			onExit()
		} else if (k === 38) { // up
			zoomIn()
		} else if (k === 40) {
			zoomOut()
		}
	}

	const onExit = () => {
		dispatch('close')
		idx = -1
		close()
		onClose()
	}
</script>

<svelte:window on:keydown={onKeydown} on:resize={debounce(setDimension, 100)}/>

{#if idx >= 0 && !no_backdrop}
	<div transition:fade={{duration: 250}} class="fixed inset-0 z-40 bg-black bg-opacity-70"></div>
{/if}

{#if idx >= 0}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<button on:click={onExit}
		        class="flex items-center justify-center w-8 h-8 bg-white hover:bg-opacity-80 rounded-full z-50 btn absolute top-4 right-4">
			<Icon name="close" className="w-4"/>
		</button>
		{#if !is_single_image}
			<button on:click|stopPropagation={onLeftClick}
			        class:opacity-10={is_first}
			        class="flex items-center justify-center w-8 h-8 bg-white hover:bg-opacity-80 rounded-full z-50 btn absolute top-1/2 left-4 transform -translate-y-1/2">
				<Icon name="right" className="transform rotate-180 w-4"/>
			</button>
			<button on:click|stopPropagation={onRightClick}
			        class:opacity-10={is_last}
			        class="flex items-center justify-center w-8 h-8 bg-white hover:bg-opacity-80 rounded-full z-50 btn absolute top-1/2 right-4 transform -translate-y-1/2">
				<Icon name="right" className="w-4"/>
			</button>
		{/if}

		{#if src}
			{#if isPdf(src)}
				<iframe class="h-screen w-screen" {src} frameborder="0"></iframe>
			{:else}
				<img transition:fade={{duration: 250}} bind:this={staged_img_el} {src} on:load={onLoad} alt="haha" class="mx-auto rounded"/>
				<div class="bg-black rounded-full text-white flex px-8 py-2 bg-opacity-80 items-center fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
					<button on:click={zoomIn} class="w-8 h-8 rounded-full cc" class:opacity-30={!can_zoom_in}>
						<Icon name="zoom-in"/>
					</button>
					<div class="w-4"></div>
					<button on:click={zoomOut} class="w-8 h-8 rounded-full cc" class:opacity-30={!can_zoom_out}>
						<Icon name="zoom-out"/>
					</button>
				</div>
			{/if}
		{/if}
	</div>
{/if}

