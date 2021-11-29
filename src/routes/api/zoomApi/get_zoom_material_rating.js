import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/get_zoom_material_rating', {
		student_ud: req.body.student_id,
		item_id: req.body.item_id
	})
}