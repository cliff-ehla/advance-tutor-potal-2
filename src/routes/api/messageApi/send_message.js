import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/messageApi/send_message', {
		tutor_group_id: req.body.tutor_group_id,
		student_id: req.body.student_id,
		image_url: req.body.image_url
	})
}