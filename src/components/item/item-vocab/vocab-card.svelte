<script>
	import {onMount} from 'svelte'
	import { debounce } from "debounce";
	export let vocab

	const RATIO = 1.5
	let height
	let width
	const Default_image = 'https://ehla-media-bucket.s3.amazonaws.com/assets/vocab_image/vocabulary.png'

	const setDimension = () => {
		let h1 = window.innerHeight * 0.8
		let h2 = window.innerWidth * RATIO
		height = Math.min(h1, h2)
		width = height / RATIO
	}

	const onWindowResize = debounce(setDimension, 100)

	onMount(setDimension)
</script>

<svelte:window on:resize={onWindowResize}/>

<div style="width: {width}px; height: {height}px"
     class="flex flex-col rounded overflow-hidden bg-white shadow">
	<div class="relative">
		<div style="padding-top: 56%"></div>
		<img class="absolute inset-0" src="{vocab.vocab_image_path || vocab.cat_image_url || vocab.thumbnail_path || Default_image}" alt="{vocab.word}">
	</div>
	<div class="flex-1 flex items-center justify-center p-8">
		<div class="text-center">
			<p class="text-h1 font-bold mb-4">{vocab.word}</p>
			<p class="text-t1">{vocab.translation || vocab.description_alter}</p>
		</div>
	</div>
</div>

