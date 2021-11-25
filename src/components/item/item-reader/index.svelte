<script>
	import VideoPlayer from './video-player.svelte'
	import {parseOldSentenceSrt, parseNewSentenceSrt} from "../../../utils/srt-parser";
	import {onMount} from 'svelte'

	export let item
	$: media = item && item.media[0]
	$: audio_path = media && media.file_path
	$: video_path = media && media.file_path_slider
	$: old_srt_path = media && media.sub_ori_path

	let srtResult
	let current_sentence_id
	let sentence_id
	let scroll_div

	onMount(async () => {
		let timeline = media.timeline
		let srt = media.srt
		let srt_alter = media.srt_alter
		if (old_srt_path) {
			srtResult = await parseOldSentenceSrt(old_srt_path)
		} else {
			srtResult = await parseNewSentenceSrt(timeline, srt, srt_alter)
		}
	})

	const onUpdate = (e) => {
		if (e.detail === current_sentence_id) return
		current_sentence_id = e.detail
		sentence_id = e.detail
		let s = `[data-id="${sentence_id}"]`
		let el = scroll_div.querySelector(s)
		if (el) {
			let each_sentence_h = el.clientHeight
			let offset = 2
			scroll_div.scrollTop = el.offsetTop - scroll_div.offsetTop - (each_sentence_h * offset)
		}
	}
</script>

<div class="flex flex-col bg-gray-100" style="height: calc(100vh - 35px)">
	<div class="flex justify-center bg-black">
		<VideoPlayer on:update={onUpdate} videoSrc={video_path} audioSrc={audio_path} {srtResult}/>
	</div>
	<div class="flex-1 overflow-y-scroll" bind:this={scroll_div} style="scroll-behavior: smooth;">
		{#if srtResult}
			{#each srtResult as sentence}
				<p data-id={sentence.id} class="border-b border-gray-200 py-4 px-8 text-p2 leading-tight transition transition-colors {sentence.id === sentence_id ? 'border-gray-300 bg-white text-blue-500' : 'text-gray-500'}">
					{sentence.content}
				</p>
			{/each}
		{/if}
	</div>
</div>