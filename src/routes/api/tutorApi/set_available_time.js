import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/list_available_timeslot', {
		start_time: req.body.start_time,
		end_time: req.body.end_time,
		timeslot: req.body.timeslot,
		timeslot_id: req.body.timeslot_id
	})
}