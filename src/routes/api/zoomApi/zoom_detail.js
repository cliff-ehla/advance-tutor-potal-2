import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/zoom_detail', {
		wrapper_id: req.body.wrapper_id
	})
}