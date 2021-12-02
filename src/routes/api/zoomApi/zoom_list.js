import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/zoom_list', {
		tutor_group_id: req.body.tutor_group_id,
		child_id: req.body.child_id
	})
}