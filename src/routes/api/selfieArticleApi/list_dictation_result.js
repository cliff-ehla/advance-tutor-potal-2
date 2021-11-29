import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/selfieArticleApi/list_dictation_result', {
		lesson_id: req.body.lesson_id,
		tutor_group_id: req.body.tutor_group_id,
		day_id: req.body.day_id,
		child_id: req.body.child_id,
		article_id: req.body.article_id
	})
}