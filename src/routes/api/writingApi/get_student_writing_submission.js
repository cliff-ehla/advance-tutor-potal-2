import {usermodel} from "$lib/usermodal";

export const post = async (req) => {
	const {body, status} = await usermodel(req, '/writingApi/get_student_writing_submission', {
		user_writing_id: req.body.user_writing_id
	})
	const data = body.data
	let marking_category = ['content', 'organizations', 'sentence', 'vocabulary', 'language']
	marking_category = marking_category.map(cat => ({
		title: cat,
		max_mark: data[`${cat}_mark_max`],
		user_mark: data[`${cat}_mark`],
		comments: data.comments[cat]
	}))
	marking_category = marking_category.filter(cat => cat.max_mark > 0)
	const result = {
		marking_category,
		user_handwriting_images: data.images,
		overall_msg: data.overall_msg,
		disclose: data.disclose,
		is_read: data.is_read
	}
	return {
		status,
		body: {
			data: result,
			success: true
		}
	}
}