import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/selfieVocabListApi/get_vocab_list_by_id', {
		vocab_list_id: req.body.vocab_list_id,
		child_id: req.body.child_id
	})
}