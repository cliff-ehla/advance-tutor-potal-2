<script>
	import {fly} from 'svelte/transition'
	export let opened = false
	export let disabled = false
	export let classname = 'absolute rounded py-2 shadow-lg right-0 bg-white border border-gray-300 w-72 z-50'
	export let contextClick = false
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()

	const onClick = () => {
		setTimeout(() => {
			opened = true
			dispatch('input', opened)
		}, 0)
	}
	const onWindowClick = e => {
		const clickOnMenu = !!e.target.closest('.menu')
		if (clickOnMenu && contextClick) return
		opened = false
		dispatch('input', opened)
	}
</script>
<div class="relative" on:mouseenter={() => {opened = true}} on:mouseleave={() => {opened = false}}>
	<div class="cursor-pointer" on:click={onClick}>
		<slot name="activator"/>
	</div>
	{#if opened && !disabled}
		<div transition:fly={{y:30}} class="menu {classname}">
			<slot/>
		</div>
	{/if}
</div>

<svelte:window on:click={onWindowClick}/>