import {usermodel} from "$lib/usermodal";

export const get = async (req) => {
	const {status, body} = await usermodel(req, '/writingApi/writings_comment_map?subject=english')
	const data = body.data
	const object = {}
	for (const prop in data) {
		object[prop] = [...data[prop].good, ...data[prop].improve, ...data[prop].weakness]
	}
	return {
		status,
		body: {
			data: object,
			success: true
		}
	}
}