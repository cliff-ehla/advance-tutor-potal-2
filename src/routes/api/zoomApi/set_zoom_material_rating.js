import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/set_zoom_material_rating', {
		student_id: req.body.student_id,
		item_id: req.body.item_id,
		t_difficulty_rate: req.body.t_difficulty_rate
	})
}