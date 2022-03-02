import {writable} from "svelte/store";

function createDialogStore () {
	const store = writable({
		visible: false,
		title: '',
		message: '',
		checkbox: '',
		text_input: '',
		image_url: '',
		onConfirm: () => {},
		onSuccess: () => {}
	})
	const confirm = ({message, title, checkbox, text_input, image_url, onConfirm, onSuccess}) => {
		if (!onConfirm) onConfirm = () => {}
		if (!onSuccess) onSuccess = () => {}
		store.set({
			visible: true,
			title: title || 'Are you sure？',
			checkbox,
			text_input,
			message,
			image_url,
			onConfirm,
			onSuccess
		})
	}
	const close = () => {
		store.set({
			visible: false,
			title: '',
			message: '',
			checkbox: '',
			text_input: '',
			image_url: '',
			onConfirm: () => {},
			onSuccess: () => {}
		})
	}
	return {
		subscribe: store.subscribe,
		confirm,
		close
	}
}

export const dialog = createDialogStore()