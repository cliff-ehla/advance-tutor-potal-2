<script>
	export let videoSrc
	export let audioSrc = undefined
	export let srtResult = undefined
	export let autoplay = false
	export let loop = false
	export let preload = false

	import {onMount, createEventDispatcher} from 'svelte'
	import SrtSentence from './srt-renderer.svelte'
	import SIcon from '../../ui-elements/icon.svelte'
	import Slider from 'svelte-slider'
	import {secondToMin} from "../../../utils/time";
	import {debounce} from 'debounce'

	const dispatch = createEventDispatcher()
	export let VideoEl = undefined

	// media binding
	export let currentTime = undefined
	export let duration = undefined
	export let paused = undefined
	export let ended = undefined
	export let volume = undefined

	let loading = true
	let videoLoaded = false
	let audioLoaded = !audioSrc
	let AudioEl
	let VideoWrapEl
	let video_width

	let _timerId
	let control_visible = true

	// SRT logic
	let enableTranslation = true

	$: _videoSrc = Array.isArray(videoSrc) ? videoSrc : [videoSrc]
	$: barValue = currentTime / duration
	$: displayTotalTime = secondToMin(duration)
	$: displayCurrentTime = secondToMin(currentTime)

	/**
	 * need autoplay declared on audio element
	 * and need this callback function to stop audio play when video is not ready
	 */
	function onAudioPlay () {
		if (!videoLoaded) AudioEl.pause()
	}

	function onVideoPlay () {
		// sync audio time to video time
		if (audioSrc) {
			if (!audioLoaded) return VideoEl.pause()
			AudioEl.currentTime = VideoEl.currentTime
			AudioEl.play().then(() => {
				control_visible = false
				setTimeout(() => {
					if (AudioEl.paused) {
						AudioEl.currentTime = VideoEl.currentTime
						AudioEl.play()
					}
				}, 300)
			}).catch(_ => {
				VideoEl.pause()
			})
		}
	}

	function onAudioCanplay () {
		audioLoaded = true
		if (videoLoaded) {
			loading = false
		}
	}

	function onVideoCanplay () {
		videoLoaded = true
		if (audioLoaded) {
			loading = false
		}
	}

	function onBarChange (e) {
		let v = e.detail[1]
		currentTime = duration * v
		if (audioSrc) {
			AudioEl.currentTime = currentTime
		}
		if (paused) play()
	}

	export function load () {
		loading = true
		VideoEl.load()
	}

	export function stop () {
		VideoEl.pause()
		currentTime = 0
	}

	export function pause () {
		VideoEl.pause()
		if (AudioEl) {
			AudioEl.pause()
		}
	}

	export function replay () {
		currentTime = 0
		play()
	}

	export function play () {
		control_visible = true
		let p1 = VideoEl.play()
		let p2
		if (AudioEl) {
			AudioEl.currentTime = VideoEl.currentTime
			p2 = AudioEl.play()
		} else {
			p2 = Promise.resolve()
		}
		return Promise.all([p1,p2]).then((_p1, _p2) => {
			control_visible = false
		}).catch((e1,e2) => {
			if (!VideoEl.paused && VideoEl.currentTime > 0) {
				VideoEl.pause()
			}
		})
	}

	function onVideoEnd () {
		control_visible = true
		dispatch('finish')
	}

	function onPlayerClick () {
		if (control_visible) {
			control_visible = false
		} else {
			control_visible = true
			window.clearTimeout(_timerId)
			_timerId = setTimeout(() => {
				if (!ended && !paused) control_visible = false
			}, 2000)
		}
	}

	function toggleSubtitle (e) {
		e.preventDefault()
		e.stopPropagation()
		enableTranslation = !enableTranslation
	}

	const setDimension = () => {
		let w1 = window.innerWidth
		let w2 = window.innerHeight / 2 * 16 / 9
		video_width = Math.min(w1, w2)
	}

	onMount(() => {
		setDimension()
		setTimeout(() => {
			if (control_visible) control_visible = false
		}, 50)
	})
</script>

<svelte:window on:resize={debounce(setDimension, 100)}/>

<div style="width: {video_width}px" class="mx-auto relative overflow-hidden" on:click={onPlayerClick}>
	{#if !loading && currentTime > 0 && !ended && !paused}
		{#if control_visible}
			<div on:click={pause} class="absolute inset-0 flex items-center justify-center z-30">
				<button class="w-20 h-20 rounded-full items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-80 text-white flex items-center justify-center">
					<SIcon name="pause"/>
				</button>
			</div>
		{/if}
	{:else}
		<div class="absolute inset-0 flex items-center justify-center z-30">
			{#if loading}
				Loading
			{:else if ended}
				<button on:click={replay} class="w-20 h-20 rounded-full items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-80 text-white flex items-center justify-center">
					<SIcon name="refresh"/>
				</button>
			{:else}
				<button class="w-20 h-20 rounded-full items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-80 text-white flex items-center justify-center" on:click={play}>
					<SIcon name="play"/>
				</button>
			{/if}
		</div>
	{/if}

	<div bind:this={VideoWrapEl}>
		<video bind:this={VideoEl}
		       class="w-full"
		       on:ended={onVideoEnd}
		       on:ended
		       on:play
		       on:play={onVideoPlay}
		       on:canplaythrough
		       on:canplay={onVideoCanplay}
		       on:loadedmetadata
		       {loop}
		       {preload}
		       {autoplay}
		       bind:duration
		       bind:currentTime
		       bind:paused
		       bind:ended
		       bind:volume
		       playsinline
		       x5-video-player-type="h5"
		       x5-video-orientation="landscape">
			{#each _videoSrc as v}
				<source src={v}>
			{/each}
		</video>

		{#if audioSrc}
			<audio {autoplay} on:play={onAudioPlay} on:canplay={onAudioCanplay} bind:this={AudioEl} src={audioSrc}/>
		{/if}
	</div>

	<div class="{control_visible ? 'translate-y-0' : 'translate-y-12'} transition-transform transform absolute z-30 bottom-2 inset-x-4 bg-black bg-opacity-60 rounded-full text-white">
		<div class="flex items-center px-4 py-2">
			<div class="text-xs">{displayCurrentTime}</div>
			<div class="flex-1 mx-4">
				<Slider single on:change={onBarChange} value={[0, barValue]} />
			</div>
			<div class="text-xs">{displayTotalTime}</div>
<!--
			<button class="ml-4 text-sm"
			     on:click={toggleSubtitle}
			     class:active={enableTranslation}>
				EN
			</button>-->
		</div>
	</div>

	<div class="absolute z-20 bottom-2 inset-x-0 flex justify-center">
		<SrtSentence on:update currentTime={currentTime * 1000} {srtResult} {enableTranslation}/>
	</div>
</div>

<style>
    :root {
        --sliderPrimary: #FF9800;
        --sliderSecondary: rgba(255, 255, 255, 0.05);
    }
</style>
