import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/get_tutor_group_message', {
		tutor_group_id: req.body.tutor_group_id
	})
}