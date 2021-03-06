import {http} from "$lib/http";

export async function listStudentNote ({student_id, teacher_id}, _fetch) {
	const {data, metadata} = await http.post(_fetch, '/studentNoteApi/list_student_note', {
		student_id, teacher_id
	}, _fetch)
	return {
		notes: data,
		is_note_read: !metadata.alert_on
	}
}

export async function markAsRead ({student_id}, _fetch) {
	const {data} = await http.post(_fetch,'/studentNoteApi/read_student_note', {
		student_id
	})
	return data
}

export async function createStudentNote ({student_id, note, teacher_id}, _fetch) {
	const {data} = await http.post(_fetch,'/studentNoteApi/set_student_note', {
		student_id,
		teacher_id,
		note
	})
	return data
}

export async function deleteStudentNote ({note_id}, _fetch) {
	const {data} = await http.post(_fetch,'/studentNoteApi/delete_student_note', {
		note_id
	})
	return data
}
