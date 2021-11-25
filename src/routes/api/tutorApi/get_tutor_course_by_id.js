import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/get_tutor_course_by_id', {
		tutor_group_id: req.body.tutor_group_id,
		child_id: req.body.child_id
	})
}