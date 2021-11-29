import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/update_zoom_day_task', {
		wrapper_id: req.body.wrapper_id,
		day_ids: req.body.day_ids
	})
}