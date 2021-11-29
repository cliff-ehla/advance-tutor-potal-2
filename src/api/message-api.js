import {http} from "$lib/http";

export async function fetchMessage ({tutor_group_id, student_id}, _fetch) {
	try {
		const {data} = await http.post(_fetch,`/messageApi/list_tutor_group_message`, {
			tutor_group_id, student_id
		})
		return data
	} catch (e) {}
}

export async function sendAlertMessage ({tutor_group_id, teacher_id, message_id}, _fetch) {
	try {
		const {data} = await http.post(_fetch,`/messageApi/send_alert_message`, {
			tutor_group_id, teacher_id, message_id
		})
		return data
	} catch (e) {}
}

export async function listAlertMessage (_fetch) {
	try {
		const {data} = await http.get(_fetch,`/messageApi/list_alert_message`)
		return data
	} catch (e) {}
}

export async function deleteMessage ({message_id}, _fetch) {
	try {
		const {data} = await http.post(_fetch,`/messageApi/mark_delete_message`, {
			message_id
		})
		return data
	} catch (e) {}
}