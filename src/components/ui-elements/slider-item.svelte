<script>
	import {getContext} from 'svelte'
	const {setChildEl} = getContext('slider')
</script>

<div class="slider-item" use:setChildEl><slot/></div>

<style>
	.slider-item {
		transition: transform 0.3s;
		height: 100%;
	}
</style>
