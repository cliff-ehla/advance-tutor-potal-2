const http = (() => {
	async function get (fetch, resource, query) {
		if (query) {
			for (const property in query) {
				// TODO ? &
				resource += `?${property}=${query[property]}`
			}
		}
		const res = await fetch('/api' + resource)
		return await res.json()
	}

	async function post (fetch, resource, body = {}) {
		// an empty object is necessary, otherwise result fatal error when not passing body params
		try {
			const res = await fetch('/api' + resource, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: body && JSON.stringify(body)
			})
			return await res.json()
		} catch (e) {
			console.log('fatal error: this mostly happened when usermodel do not return a json body', e)
			return {
				success: false,
				data: false,
				status: 400,
				debug: 'Usermodel return fatal error'
			}
		}
	}

	return {
		get,
		post
	}
})()

export {http}