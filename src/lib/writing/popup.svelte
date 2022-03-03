<script>
	import {setContext} from 'svelte'
	import {fly} from 'svelte/transition'

	const key = 'simple-popup'

	let component = null
	let props = null
	let options = null

	const toVoid = () => {}
	let onClose = toVoid

	let activator_rect
	let opened = false

	const open = (
		NewComponent,
		new_activator_rect,
		newProps = {},
		new_options = {},
		callback = {}
	) => {
		component = NewComponent
		props = newProps
		options = new_options
		activator_rect = new_activator_rect
		onClose = callback.onClose || toVoid
	}

	const setPosition = (node) => {
		setTimeout(() => {
			opened = true
		}, 10)
		const r2 = node.getBoundingClientRect()
		const popup_width = Math.min(Math.max(options.width, 320), window.innerWidth * 0.8)
		let words_width = Math.min(activator_rect.width, window.innerWidth * 0.8)
		let left = activator_rect.left - (popup_width - words_width) / 2
		let top = activator_rect.top - r2.height - 10
		let max_left = window.innerWidth - popup_width - 10
		let min_left = 10
		left = Math.min(left, max_left)
		left = Math.max(left, min_left)
		node.style.left = left + 'px'
		node.style.top = top + 'px'
		node.style.minWidth = popup_width + 'px'
	}

	const close = () => {
		component = null
		props = null
		opened = false
		onClose()
	}

	setContext(key, { open, close });

	const onKeyDown = e => {
		if (!opened) return
		let code = e.keyCode
		if (code === 27) close()
	}

	const onClick = (e) => {
		if (!opened) return
		let parent = e.target.closest('.popup')
		if (!parent) close()
	}
</script>

{#if component}
	<div transition:fly={{y: 20, duration:300}} class="popup fixed z-50 shadow-lg" use:setPosition>
		<svelte:component this={component} {...props}/>
		<svg style="margin-top: -1px" class="fill-current absolute z-50 w-3 h-3 top-full left-1/2 -ml-1.5 text-blue-500" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M9 15L0.339746 -1.63133e-06L17.6603 -1.17124e-07L9 15Z"/>
		</svg>
	</div>
{/if}

<slot></slot>

<svelte:window on:keydown={onKeyDown} on:click={onClick}/>
