import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/zoom_list_all', {
		start_time: req.body.start_time,
		end_time: req.body.end_time,
	})
}