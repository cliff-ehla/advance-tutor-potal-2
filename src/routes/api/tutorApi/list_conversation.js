import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/tutorApi/list_conversation')
}