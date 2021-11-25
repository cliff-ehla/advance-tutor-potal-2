import {writable} from "svelte/store";
import updateEntities from './update-entities'

const item_store = () => {
	const store = writable({
		dict: {
			item: {}
		}
	})

	const saveItemDict = (id, dict) => {
		store.update(v => ({
			...v,
			dict: updateEntities(v.dict, {
				item: {
					[id]: dict
				}
			})
		}))
	}

	return {
		subscribe: store.subscribe,
		saveItemDict
	}
}

export default item_store()