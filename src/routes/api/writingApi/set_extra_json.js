import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/writingApi/set_extra_json', {
		user_writing_id: req.body.user_writing_id,
		extra_json: req.body.extra_json
	})
}