import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/delete_available_timeslot', {
		timeslot_id: req.body.timeslot_id
	})
}