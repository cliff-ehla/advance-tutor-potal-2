import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/writingApi/submit_comment', {
		comments: req.body.comments,
		user_writing_id: req.body.user_writing_id
	})
}