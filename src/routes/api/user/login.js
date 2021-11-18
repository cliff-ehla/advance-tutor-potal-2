import {usermodel} from "$lib/usermodal";
import cookie from "cookie";

export const post = async (req) => {
	const res = await usermodel(req, '/userApi/login', {
		username: req.body.username,
		password: req.body.password
	})

	if (res.body.success) {
		let _cookie = cookie.serialize('access_token', res.body.data[0].user_session.access_token, {
			path: '/',
			httpOnly: true
		});

		return {
			status: res.status,
			headers: {
				'set-cookie': _cookie
			},
			body: res.body
		}
	}

	return res
}