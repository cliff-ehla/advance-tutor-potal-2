import {writable} from "svelte/store";
import {http} from "$lib/http.js";

const create_store = () => {
	const store = writable({})
	const object = {
		note: []
	}
	const fetchStudentNote = async (fetch, {student_id}) => {
		const {data} = await http.post(fetch, '/studentNoteApi/list_student_note', {
			student_id
		})
		store.update(v => ({
			...v,
			[student_id]: data
		}))
		return data
	}
	return {
		fetchStudentNote,
		subscribe: store.subscribe
	}
}

export const student_store = create_store()