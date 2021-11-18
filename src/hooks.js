import cookie from 'cookie';

export const handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	request.locals.access_token = cookies.access_token;

	// TODO https://github.com/sveltejs/kit/issues/1046
	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

	return resolve(request);
};

export const getSession = req => {
	let access_token = req.locals.access_token
	return access_token ? {
		access_token
	}: {}
}