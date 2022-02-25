import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/advanced_zoom_list_all_for_tutor', {
		start_date: req.body.start_time,
		end_date: req.body.end_time,
	})
}