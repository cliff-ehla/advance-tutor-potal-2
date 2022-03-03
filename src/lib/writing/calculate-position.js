export const calculatePosition = (e1, e2) => {
	// e1 = the ref element based on
	// e2 = popup/tooltip element
	const r1 = e1.getBoundingClientRect()
	const r2 = e2.getBoundingClientRect()
	const left = r1.left - (r1.left - r2.left)
	const top = r1.top + r2.height
}
