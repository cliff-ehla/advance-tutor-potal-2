import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/get_child_material_list', {
		child_id: req.body.child_id
	})
}