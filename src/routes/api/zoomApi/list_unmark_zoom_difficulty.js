import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/list_unmark_zoom_difficulty', {
		teacher_id: req.body.teacher_id
	})
}