import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/list_fans_detail_overview', {
		student_id: req.body.student_id
	})
}