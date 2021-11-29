import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/studentNoteApi/set_student_note', {
		student_id: req.body.student_id,
		teacher_id: req.body.teacher_id,
		note: req.body.note
	})
}