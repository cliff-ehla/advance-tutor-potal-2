import {usermodel} from "$lib/usermodal";
import cookie from "cookie";

export const post = async (req) => {
	let data = await usermodel(req, '/userApi/logout')
	let _cookie = cookie.serialize('access_token', '', {
		path: '/',
		httpOnly: true,
		maxAge: 0
	});
	return {
		status: 200,
		headers: {
			'set-cookie': _cookie
		}
	}
}