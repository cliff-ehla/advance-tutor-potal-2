import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/messageApi/list_alert_message')
}