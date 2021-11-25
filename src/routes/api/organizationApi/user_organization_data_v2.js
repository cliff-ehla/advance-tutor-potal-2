 import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/organizationApi/user_organization_data_v2')
}