import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/list_tutor_salary', {
		teacher_id: req.body.teacher_id
	})
}