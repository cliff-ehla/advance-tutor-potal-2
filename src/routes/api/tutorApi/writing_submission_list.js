import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/writing_submission_list', {
		teacher_id: req.body.teacher_id
	})
}