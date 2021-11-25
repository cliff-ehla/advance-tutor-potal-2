const updateEntities = (originalDict, newDict) => {
	for (let entity in newDict) {
		for (let record in newDict[entity]) {
			const oldObj = originalDict[entity][record] || {}
			const newObj = newDict[entity][record]
			originalDict[entity][record] = Object.assign({}, oldObj, newObj)
		}
	}
	return originalDict
}
export default updateEntities