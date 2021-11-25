<!-- modified from svelte-simple-model: https://github.com/flekschas/svelte-simple-modal -->

<script>
	import { setContext as baseSetContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let key = 'simple-modal';
	export let closeButton = true;
	export let closeOnEsc = true;
	export let closeOnOuterClick = true;
	export let closeOnAnyClick = false;
	export let styleBg = { top: 0, left: 0, zIndex: 9999 };
	export let styleWindow = {};
	export let styleContent = {};
	export let setContext = baseSetContext;
	export let transitionBg = fade;
	export let transitionBgProps = { duration: 300 };
	export let transitionWindow = fly;
	export let transitionWindowProps = { duration: 300, y: 100 };

	const defaultState = {
		closeButton,
		closeOnEsc,
		closeOnOuterClick,
		closeOnAnyClick,
		styleBg,
		styleWindow,
		styleContent,
		transitionBg,
		transitionBgProps,
		transitionWindow,
		transitionWindowProps,
	};
	let state = { ...defaultState };

	let Component = null;
	let props = null;

	let background;
	let wrap;

	const camelCaseToDash = str => str
			.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

	const toCssString = (props) => Object.keys(props)
			.reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '');

	$: cssBg = toCssString(state.styleBg);
	$: cssWindow = toCssString(state.styleWindow);
	$: cssContent = toCssString(state.styleContent);
	$: currentTransitionBg = state.transitionBg;
	$: currentTransitionWindow = state.transitionWindow;

	const toVoid = () => {};
	let onOpen = toVoid;
	let onClose = toVoid;
	let onOpened = toVoid;
	let onClosed = toVoid;

	const open = (
			NewComponent,
			newProps = {},
			options = {},
			callback = {}
	) => {
		Component = NewComponent;
		props = newProps;
		state = { ...defaultState, ...options };
		onOpen = callback.onOpen || toVoid;
		onClose = callback.onClose || toVoid;
		onOpened = callback.onOpened || toVoid;
		onClosed = callback.onClosed || toVoid;
	};

	const close = (callback = {}) => {
		onClose = callback.onClose || onClose;
		onClosed = callback.onClosed || onClosed;
		Component = null;
		props = null;
	};

	const handleKeyup = (event) => {
		if (state.closeOnEsc && Component && event.key === 'Escape') {
			event.preventDefault();
			close();
		}
	};

	const handleOuterClick = (event) => {
		if (
				state.closeOnOuterClick && (
						event.target === background || event.target === wrap
				)
		) {
			event.preventDefault();
			close();
		}
	};

	const handleWindowClick = () => {
		if (state.closeOnAnyClick) {
			event.preventDefault();
			close();
		}
	}

	setContext(key, {
		open: open ,
		close: close
	});
</script>

<svelte:window on:click={handleWindowClick} on:keyup={handleKeyup}/>

{#if Component}
	<div
					class="fixed flex justify-center items-center w-full h-full bg-black bg-opacity-60"
					on:click={handleOuterClick}
					bind:this={background}
					transition:currentTransitionBg={state.transitionBgProps}
					style={cssBg}
	>
		<div class="relative m-8 max-h-full" bind:this={wrap}>
			<div
							class="relative max-w-full max-h-full m-8 rounded bg-white"
							transition:currentTransitionWindow={state.transitionWindowProps}
							on:introstart={onOpen}
							on:outrostart={onClose}
							on:introend={onOpened}
							on:outroend={onClosed}
							style={cssWindow}
			>
				<div class="relative px-8 py-4 overflow-auto" style="{cssContent}; max-height: calc(100vh - 4rem)">
					{#if state.closeButton}
						<button class="cc w-8 h-8 absolute -right-8 -top-8 fill-current rounded-full bg-white hover:bg-opacity-80" on:click={close}>
							<svg class="w-4" width="24" height="24" viewBox="0 0 24 24"><path d="M23.3846 19.4714L4.57577 0.662593C3.75546 -0.157713 2.42554 -0.157713 1.60652 0.662593L0.615229 1.65234C-0.205076 2.4729 -0.205076 3.80283 0.615229 4.62185L19.4241 23.4307C20.2446 24.251 21.5746 24.251 22.3936 23.4307L23.3833 22.4409C24.2052 21.6219 24.2052 20.2917 23.3846 19.4714Z"/><path d="M19.424 0.6624L0.615228 19.4712C-0.205076 20.2915 -0.205076 21.6217 0.615228 22.4407L1.60498 23.4305C2.42554 24.2508 3.75546 24.2508 4.57448 23.4305L23.3846 4.62294C24.2051 3.80263 24.2051 2.47271 23.3846 1.65369L22.3948 0.663938C21.5745 -0.157905 20.2446 -0.157905 19.424 0.6624Z"/></svg>
						</button>
					{/if}
					<svelte:component this={Component} {...props} />
				</div>
			</div>
		</div>
	</div>
{/if}
<slot></slot>
