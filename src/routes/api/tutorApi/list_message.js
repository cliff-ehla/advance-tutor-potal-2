import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/list_message', {
		is_new: req.body.is_new,
		page: req.body.page,
		limit: req.body.limit,
	})
}