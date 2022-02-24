export const slugToText = (text) => {
	if (!text) return
	let t = text.replace('-', ' ')
	return t.charAt(0).toUpperCase() + t.slice(1)
}