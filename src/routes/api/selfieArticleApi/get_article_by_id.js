import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/selfieArticleApi/get_article_by_id', {
		article_id: req.body.article_id,
		child_id: req.body.user_id
	})
}