import {http} from "$lib/http";

export async function getResultById (result_id, lesson_id, tutor_group_id, day_id, child_id, _fetch) {
	try {
		const {data, metadata} = await http.post(`resultApi/get_result_by_id`, {
			result_id, lesson_id, tutor_group_id, day_id, child_id
		},_fetch)
		const questions = metadata.question_map
		const qtn_detail = data.qtn_detail
		return {data, questions, qtn_detail}
	} catch (e) {}
}