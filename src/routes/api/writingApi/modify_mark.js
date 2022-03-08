import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/writingApi/modify_mark', {
		user_writing_id: req.body.user_writing_id,
		disclose: req.body.disclose, // 0 = draft, 1 = submit
		content_mark: req.body.content_mark || 0,
		language_mark: req.body.language_mark || 0,
		organizations_mark: req.body.organizations_mark || 0,
		vocabulary_mark: req.body.vocabulary_mark || 0,
		sentence_mark: req.body.sentence_mark || 0,
		overall_msg: req.body.overall_msg,
		overall_audio_objs: []
	})
}