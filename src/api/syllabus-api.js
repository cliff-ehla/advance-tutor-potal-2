import {http} from "$lib/http";
import {syllabus_store} from "../store";

export async function listAllCategory () {
	try {
		const {data} = await http.get('syllabusApi/list_all_category')
		syllabus_store.set(data)
		return data
	} catch (e) {}
}

export async function updateSyllabus ({tutor_group_id, category_level, category_type}) {
	try {
		const {data} = await http.post('syllabusApi/update_syllabus_in_tutor_group', {
			tutor_group_id,
			syllabus_detail: [
				{
					category_type,
					category_level
				}
			]
		})
		return data
	} catch (e) {}
}
