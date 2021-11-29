<script>
	import {stores} from '$app/stores'
	import {left_bar_visible} from "../../../../../../store";
	import {onMount} from 'svelte'

	const {page, session} = stores()
	const {item_id} = $page.params

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<div class="p-8">
	Loading...
</div>

<iframe class="absolute inset-0 w-full h-full" src="https://ehla-baby.com/fun/game-json/{item_id}?accessToken={$session.access_token}" frameborder="0"></iframe>
