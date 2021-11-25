import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/list_lesson_report_by_tutor_group_id', {
		tutor_group_id: req.body.tutor_group_id
	})
}