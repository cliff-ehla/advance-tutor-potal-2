import http from "../http";

export async function getVoicesReport ({lesson_id, tutor_group_id, day_id, child_id, sentences, vocabs}, _fetch) {
	try {
		const {data} = await http.post('voiceApi/voices_by_item_id_v2', {
			lesson_id, tutor_group_id, day_id, child_id, sentences, item_id: '6', vocabs
		}, _fetch)
		return data
	} catch (e) {}
}