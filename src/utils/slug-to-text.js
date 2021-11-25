export const slugToText = slug => {
	let words = slug.split('-')
	return words.map(w => w.charAt(0).toUpperCase() + w.slice(1, w.length)).join(' ')
}