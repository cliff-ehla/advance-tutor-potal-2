import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/list_fans_detail', {
		student_id: req.body.student_id,
		is_current: req.body.is_current
	})
}