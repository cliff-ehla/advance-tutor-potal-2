import {http} from "$lib/http";
import {item_store} from "../store";
import {get} from 'svelte/store'

export async function getItem (id, _fetch, options) {
	const use_cache = options && options.use_cache
	const item = get(item_store).dict.item[id]
	const item_vocab = item && item.vocabs
	try {
		if (item_vocab && use_cache) return console.log('get_by_ids use cache')
		const {data} = await http.post(_fetch, '/itemApi/get_by_ids', {
			ids: [id]
		})
		let item = data && data[0]
		item_store.saveItemDict(id, item)
		return item
	} catch (e) {
		console.log(e)
	}
}

export async function getItemWebview (id, page, _fetch, options) {
	const use_cache = options && options.use_cache
	try {
		const item = get(item_store).dict.item[id]
		const webview = item && item[`webview_${page}`]
		if (webview && use_cache) return console.log('get_by_ids use cache')
		const {data} = await http.post(_fetch, '/itemApi/webview', {
			item_id: id,
			page
		})
		item_store.saveItemDict(id, {
			[`webview_${page}`]: data.url
		})
	} catch (e) {
		console.log(e)
	}
}

export async function getVideoItems (ids, options) {
	const use_cache = options && options.use_cache
	try {
		const {data} = await http.post(_fetch, 'itemApi/get_by_ids', {
			ids
		})
		data.forEach(item => {
			item_store.saveItemDict(item.id, item)
		})
	} catch (e) {
		console.log(e)
	}
}