<div class="srt" class:hidden={!subtitle_visible}>
	{#if subtitle_en_visible}
		<div class="srt__title">{subtitle}</div>
	{/if}
	{#if subtitle_alter_visible}
		<div class="srt__subtitle">{subtitleAlter}</div>
	{/if}
</div>

<script>
	import {createEventDispatcher} from 'svelte'
	export let currentTime
	export let srtResult = undefined // can pass srtResult directly
	export let enableTranslation = true // toggle alter translation

	const dispatch = createEventDispatcher()
	let subtitle
	let subtitleAlter

	$: subtitle_alter_visible = !!subtitleAlter && enableTranslation
	$: subtitle_en_visible = !!subtitle
	$: subtitle_visible = subtitle_alter_visible || subtitle_en_visible

	$: {
		if (srtResult) {
			let obj = srtResult.find((o)=>{
				let current = currentTime
				return current >= o.startTime && current <= o.endTime
			})
			const _subtitle = obj && obj.content
			const _subtitleAlter = obj && obj.content_alter
			subtitle = _subtitle || ''
			subtitleAlter = _subtitleAlter || ''
			dispatch('update', obj && obj.id)
		}
	}
</script>

<style>
    .srt {
        background: rgba(0,0,0,0.5);
        border-radius: 1em;
        padding: .5em 1em;
        line-height: 1.2;
        text-align: center;
        display: inline-block;
        color: white;
        pointer-events: none;
    }

    .srt__subtitle {
        font-size: 0.8em;
    }

    .srt__title + .srt__subtitle {
        margin-top: .5em;
    }

    .hidden {
        visibility: hidden;
    }
</style>
