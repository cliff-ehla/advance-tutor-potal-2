import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/messageApi/list_class_alert_message')
}