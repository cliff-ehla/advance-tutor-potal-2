import {http} from "$lib/http";

export async function getSelfieArticle (params, _fetch) {
	try {
		const {lesson_id, tutor_group_id, day_id, child_id, article_id} = params
		const {data} = await http.post(_fetch,'/selfieArticleApi/get_article_by_id', {
			child_id, day_id, lesson_id, tutor_group_id, article_id
		})
		return data
	} catch (e) {}
}

export async function getSelfieVocab (vocab_list_id, child_id, _fetch) {
	try {
		const {data} = await http.post(_fetch,'/selfieVocabListApi/get_vocab_list_by_id', {
			vocab_list_id, child_id
		})
		return data
	} catch (e) {}
}

export async function getDictationResultList ({lesson_id, tutor_group_id, day_id, child_id, article_id}, _fetch) {
	try {
		const {data} = await http.post(_fetch, '/selfieArticleApi/list_dictation_result', {
			lesson_id, tutor_group_id, day_id, child_id, article_id
		})
		return data
	} catch (e) {}
}
