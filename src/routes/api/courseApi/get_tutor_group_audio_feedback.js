import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/get_tutor_group_audio_feedback', {
		tutor_group_id: req.body.tutor_group_id,
		lesson_id: req.body.lesson_id,
		day_id: req.body.day_id,
		child_id: req.body.child_id
	})
}