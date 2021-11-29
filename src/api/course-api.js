import {http} from "$lib/http";

export async function getAudioFeedback (courseInfo, _fetch) {
	try {
		let { lesson_id, tutor_group_id, day_id, child_id } = courseInfo
		const {data} = await http.post(_fetch,'/courseApi/get_tutor_group_audio_feedback', {
			lesson_id, tutor_group_id, day_id, child_id
		})
		return data
	} catch (e) {}
}

export async function fetchCourseNote ({tutor_group_id}, _fetch) {
	try {
		const {data} = await http.post(_fetch,'/courseApi/get_tutor_group_message', {
			tutor_group_id
		})
		return data
	} catch (e) {}
}

export async function setCourseNote ({tutor_group_id, message}, _fetch) {
	try {
		const {data} = await http.post(_fetch, '/courseApi/set_tutor_group_message', {
			tutor_group_id,
			message
		})
		return data
	} catch (e) {}
}