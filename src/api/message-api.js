import http from "../http";

export async function fetchMessage ({tutor_group_id, student_id}, _fetch) {
	try {
		const {data} = await http.post(`messageApi/list_tutor_group_message`, {
			tutor_group_id, student_id
		},_fetch)
		return data
	} catch (e) {}
}

export async function sendAlertMessage ({tutor_group_id, teacher_id, message_id}, _fetch) {
	try {
		const {data} = await http.post(`messageApi/send_alert_message`, {
			tutor_group_id, teacher_id, message_id
		},_fetch)
		return data
	} catch (e) {}
}

export async function listAlertMessage () {
	try {
		const {data} = await http.get(`messageApi/list_alert_message`)
		return data
	} catch (e) {}
}

export async function deleteMessage ({message_id}) {
	try {
		const {data} = await http.post(`messageApi/mark_delete_message`, {
			message_id
		})
		return data
	} catch (e) {}
}