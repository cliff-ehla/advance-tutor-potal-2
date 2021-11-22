import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/zoomApi/zoom_list_all')
}