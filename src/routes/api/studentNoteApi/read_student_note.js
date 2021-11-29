import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	return usermodel(req, '/studentNoteApi/read_student_note', {
		student_id: req.body.student_id
	})
}