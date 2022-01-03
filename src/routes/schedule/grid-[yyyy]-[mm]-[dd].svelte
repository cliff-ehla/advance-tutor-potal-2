<script>
	import {zoom_store} from "$lib/store/zoom.js";
	import {browser} from "$app/env";
	import ZoomPreviewPopup from '$lib/zoom/zoom-preview-popup.svelte'
	import {getContext} from 'svelte'
	const {showPopper, closePopper} = getContext('popper')

	let calendar

	const SOURCE_ID = 'id'

	$: {
		if ($zoom_store && browser && calendar) {
			reRenderEvents()
		}
	}

	const init = (node) => {
		calendar = new FullCalendar.Calendar(node, {
			eventSources: [
				{
					events: $zoom_store.events,
					id: SOURCE_ID
				}
			],
			height: 'calc(100vh - 120px)',
			headerToolbar: false,
			initialView: 'dayGridMonth',
			eventMouseEnter: ({event, el}) => {
				let zoom = event.extendedProps
				console.log(zoom)
				showPopper(el, ZoomPreviewPopup, {
					zoom
				})
			},
			eventMouseLeave: ({el}) => {
				// TODO: leave to tooltip will close the tooltip
				// closePopper()
			}
		})
		calendar.render()
	}

	const reRenderEvents = () => {
		const source = calendar.getEventSourceById(SOURCE_ID)
		if (source) {
			source.remove()
			calendar.addEventSource({
				id: SOURCE_ID,
				events: $zoom_store.events
			})
		}
	}
</script>

<div class="w-full" use:init></div>