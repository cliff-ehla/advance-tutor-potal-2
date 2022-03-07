import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/writing_submission_list_by_tutor_group_id', {
		tutor_group_id: req.body.tutor_group_id,
		teacher_id: req.body.teacher_id || '130459' // TODO
	})
}