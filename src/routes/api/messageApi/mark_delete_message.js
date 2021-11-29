import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/messageApi/mark_delete_message', {
		message_id: req.body.message_id
	})
}