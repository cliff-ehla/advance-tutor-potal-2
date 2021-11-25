import http from "../http";

export async function getVocabs (word_ids, _fetch) {
	try {
		const {data} = await http.post('vocabBuilderApi/get_by_word_ids', {
			word_ids
		}, _fetch)
		return data
	} catch (e) {}
}