<div class="flex flex-col h-full">
	<div class="flex-1 w-full relative overflow-hidden" bind:this={SliderEl}>
		<div class="dl-slider__main" class:animating
		     style="transform: translateX({translate}px); width: {total_width}px">
			<slot/>
		</div>

		<button on:click={onPrevClick}
		        class="border-2 border-gray-300 bg-white text-blue-500 rounded-full absolute left-2 top-1/2 w-12 h-12 -mt-6 flex items-center justify-center"
		        transition:scale="{{duration: 500}}">
			<Icon name="right" className="transform rotate-180 w-4"/>
		</button>
		<button on:click={onNextClick}
		        class="border-2 border-gray-300 bg-white text-blue-500 rounded-full absolute right-2 top-1/2 w-12 h-12 -mt-6 flex items-center justify-center"
		        transition:scale="{{duration: 500}}">
			<Icon name="right" className="w-4"/>
		</button>
	</div>
</div>

<svelte:window on:resize={debounce(resizeHandler, 200)} on:keydown={onKeydown}/>

<script>
	export let index = 0
	export let useItemWidth = true // slide width determined by item width
	export let slidesPerScreen = 1 // when useItemWidth is set to false
	export let prevDisabled = false
	export let nextDisabled = false
	export let nav_thumbs = []

	import Icon from './icon.svelte'
	import {createEventDispatcher, onMount, setContext, tick} from 'svelte'
	import { scale } from 'svelte/transition';
	import { debounce } from "debounce";
	const dispatch = createEventDispatcher()

	const TOUCH_SLOP = 20

	let animating = false
	let translate = 100
	let touchStartX
	let touchMoved
	let sideNavTransform
	let drag_offset = 0

	let SliderEl
	let SlideItemsEl = []
	let total_width
	let slide_item_width
	let slide_item_count = 0

	$: isFirst = index === 0
	$: isLast = index >= slide_item_count - 1

	$: {
		if (SliderEl) {
			let init_offset = 0
			if (useItemWidth) {
				init_offset = (SliderEl.clientWidth / 2) - (slide_item_width / 2)
			}
			translate = drag_offset + (-slide_item_width * index) + init_offset
		}
	}

	setContext('slider', {
		setChildEl: node => SlideItemsEl.push(node)
	})

	const setSliderAndItemWidth = () => {
		const first_item = SlideItemsEl[0]
		if (!first_item) throw 'Please include SSliderItem.svelte in slots'
		if (useItemWidth) {
			slide_item_width = first_item.children[0].clientWidth
		} else {
			slide_item_width = SliderEl.clientWidth / slidesPerScreen
		}
		slide_item_count = SlideItemsEl.length
		total_width = slide_item_width * slide_item_count
		SlideItemsEl.forEach(el => el.style.minWidth = slide_item_width + 'px')
	}

	function setSlideScale () {
		for (let i = 0; i < slide_item_count; i++){
			let offsetToCurrent = Math.abs(index - i)
			let scale = Math.max(1 - (offsetToCurrent * 0.3), 0.8)
			let slide = SlideItemsEl[i]
			slide.style.transform = `scale(${scale})`
		}
	}

	const resizeHandler = () => {
		setSliderAndItemWidth()
		setSlideScale()
	}

	const onKeydown = (e) => {
		const k = e.keyCode
		if (k === 39) {
			next()
		} else if (k === 37) {
			prev()
		}
	}

	onMount (async () => {
		await tick()
		setSliderAndItemWidth()
		setSlideScale()

		SliderEl.addEventListener('touchstart', onSideNavTouchStart,  { passive: false });
		SliderEl.addEventListener('touchmove', onSideNavTouchMove,  { passive: false });
		SliderEl.addEventListener('touchend', onSideNavTouchEnd,  { passive: false });
		return () => {
			SliderEl.removeEventListener('touchstart', onSideNavTouchStart);
			SliderEl.removeEventListener('touchmove', onSideNavTouchMove);
			SliderEl.removeEventListener('touchend', onSideNavTouchEnd);
		}
	})

	function onSideNavTouchStart (e) {
		// NOTE: do not preventDefault here as this will block the click interaction with the content inside the slider
		touchStartX = e.touches[0].pageX;
	};

	function onSideNavTouchMove (e) {
		var newTouchX = e.touches[0].pageX;
		sideNavTransform = newTouchX - touchStartX;
		if (sideNavTransform > 0 && prevDisabled) return
		if (sideNavTransform < 0 && nextDisabled) return

		touchMoved = true
		// only when user drag horizontally intentionally, block the prevent vertical scrolling
		// if block this from start - user cannot vertically scroll page when dragging on the slider
		if (Math.abs(sideNavTransform) > 20) {
			e.preventDefault()
		}
		drag_offset = sideNavTransform
	};


	function onSideNavTouchEnd  (e) {
		// NOTE: do not preventDefault here as this will block the click interaction with the content inside the slider
		if(!touchMoved) return

		animating = true
		touchMoved = false

		requestAnimationFrame(() => {
			if (Math.abs(sideNavTransform) < TOUCH_SLOP) {
				drag_offset = 0
			} else {
				const isNext = sideNavTransform < 0
				if (isNext) next()
				else prev()
				drag_offset = 0
			}
		})
	}

	const onNextClick = () => {
		dispatch('nextClick', index)
		next()
	}

	const onPrevClick = () => {
		dispatch('prevClick', index)
		prev()
	}

	export function next () {
		if (isLast) return
		animating = true
		index += 1
		setSlideScale()
		dispatch('update', index)
	}

	export function prev () {
		if (isFirst) return
		animating = true
		index -= 1
		setSlideScale()
		dispatch('update', index)
	}
</script>

<style>
	.dl-slider__main {
		display: flex;
		align-items: center;
		will-change: transform;
	}
	.dl-slider__main.animating {
		transition: transform 0.233s cubic-bezier(0, 0, 0.21, 1);
	}
</style>
