export const isPdf = filename => {
	return filename.split('.').pop() === 'pdf'
}