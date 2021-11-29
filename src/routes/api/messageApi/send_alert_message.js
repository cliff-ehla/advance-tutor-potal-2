import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/messageApi/send_alert_message', {
		message_id: req.body.message_id,
		teacher_id: req.body.teacher_id,
		tutor_group_id: req.body.tutor_group_id
	})
}