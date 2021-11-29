import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/organizationApi/get_tutor_group_item_list', {
		tutor_group_id: req.body.tutor_group_id,
		category_tag_type: req.body.category_tag_type,
		task_type: "reading-pdf"
	})
}