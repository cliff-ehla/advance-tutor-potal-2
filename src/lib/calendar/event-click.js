import ZoomPreview from '../zoom/preview.svelte'

export const onEventClick = ({event, el}, open, calendar, onRateSuccess) => {
	let zoom = event.extendedProps

	open(ZoomPreview, {
		z: zoom,
		tutor_group_id: zoom.tutor_group_id,
		onRateSuccess
	}, {
		styleContent: {
			overflow: 'initial'
		}
	})
}