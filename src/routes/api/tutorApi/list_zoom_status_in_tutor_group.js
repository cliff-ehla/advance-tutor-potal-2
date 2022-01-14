import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/list_zoom_status_in_tutor_group', {
		tutor_group_id: req.body.tutor_group_id
	})
}