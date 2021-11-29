import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/studentNoteApi/delete_student_note', {
		note_id: req.body.note_id
	})
}