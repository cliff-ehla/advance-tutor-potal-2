<script>
	import Card from './vocab-card.svelte'
	import Slider from "../../ui-elements/slider.svelte";
	import SliderItem from "../../ui-elements/slider-item.svelte";
	export let vocabs = []
</script>

<div class="overflow-hidden">
	<Slider>
		{#each vocabs as vocab}
			<SliderItem>
				<Card {vocab}/>
			</SliderItem>
		{/each}
	</Slider>
</div>