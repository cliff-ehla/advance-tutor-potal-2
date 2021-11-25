import http from "../http";

export function parseLegacyData (data) {
	data = parseContent(data)
	let para = []
	let log = []
	let comments = []
	data.forEach((paras,i) => {
		para[i] = []
		paras.forEach(w => {
			if (w.error_comments) {
				comments.push({
					pid: w.pid,
					start_wid: w.original[0].wid,
					end_wid: w.original[w.original.length - 1].wid + 1,
					text: w.error_comments
				})
			}
			if (w.type === 'normal') {
				para[i].push(w)
			} else if (w.type === 'error') {
				para[i] = [...para[i], ... w.original]
				log.push({
					type: w.error_type === 'delete_words' ? 'delete' : 'correction',
					pid: w.pid,
					start_wid: w.original[0].wid,
					end_wid: w.original[w.original.length - 1].wid + 1,
					text: w.replace
				})
			}
		})
	})
	return {
		para,
		edit_log: log,
		comments
	}
}

function parseContent (revised_result) {
	let result = []
	let userWritingContent = JSON.parse(revised_result)
	for(let p of userWritingContent) {
		result.push(parseParagraph(p))
	}
	return result
}

function parseParagraph(paragraph) {

	paragraph.wordings.map(word => {
		let newWord = word
		newWord.type = "normal"
		newWord.selected = false
		return newWord
	})

	var paragraphWordings = paragraph.wordings
	var paragraphSlice = []
	if(paragraph.errors.length > 0) {
		let startPoint = 0
		for(var error of paragraph.errors) {
			paragraphSlice = paragraphSlice.concat(
					paragraphWordings.slice(startPoint, error.error_position[0])
			)
			let errorWords = paragraphWordings.slice(error.error_position[0], (error.error_position[1] + 1))
			paragraphSlice = paragraphSlice.concat({
				"type": "error",
				"error_type": error.type,
				"error_comments": error.comments,
				"sid": paragraphWordings[error.error_position[0]].sid,
				"pid": paragraphWordings[error.error_position[0]].pid,
				"original": errorWords,
				"replace": error.replace
			})
			startPoint = error.error_position[1] + 1
		}
		paragraphSlice = paragraphSlice.concat(
				paragraphWordings.slice(startPoint, paragraphWordings.length)
		)
	} else {
		paragraphSlice = paragraphWordings
	}

	return paragraphSlice
}

export async function getUserWriting (writing_id, _fetch) {
	try {
		let data = await http.get(`writingApi/get_user_writing?id=${writing_id}`, _fetch)
		let legacy_data = data.data[0].revised_result
		let new_data = data.data[0].extra_json
		let content = new_data ? new_data : parseLegacyData(legacy_data)
		let {para, edit_log, comments} = content
		return {
			para,
			edit_log,
			comments,
			title: data.data[0].title,
			writing_id: data.data[0].id
		}
	} catch (e) {
		console.log(e)
	}
}

export async function saveEditingJson (writing_id, edit_log, para, comments, _fetch) {
	try {
		await http.post('writingApi/set_extra_json', {
			user_writing_id: writing_id,
			extra_json: {
				edit_log, para, comments
			}
		}, _fetch)
	} catch (e) {
		console.log(e)
	}
}

export async function gradeWriting (user_writing_id, marks, overall_msg, _fetch) {
	try {
		const {content_mark, language_mark, organizations_mark, vocabulary_mark, sentence_mark} = marks
		return http.post('writingApi/modify_mark', {
			user_writing_id,
			disclose: 1, // 0 = draft, 1 = submit
			content_mark: content_mark || 0,
			language_mark: language_mark || 0,
			organizations_mark: organizations_mark || 0,
			vocabulary_mark: vocabulary_mark || 0,
			sentence_mark: sentence_mark || 0,
			overall_msg,
			overall_audio_objs: []
		}, _fetch)
	} catch (e) {
		console.log(e)
	}
}

export async function getCommentsTemplate (_fetch) {
	const {data} = await http.get('writingApi/writings_comment_map?subject=english', _fetch)
	const object = {}
	for (const prop in data) {
		object[prop] = [...data[prop].good, ...data[prop].improve, ...data[prop].weakness]
	}
	return object
}

export async function submitComments (user_writing_id, comments) {
	const {data} = await http.post('writingApi/submit_comment', {
		comments,
		user_writing_id
	})
}

export async function listRejectCommentSample () {
	const {data} = await http.get('writingApi/list_sample_reject_comment')
	return data
}

export async function rejectWriting ({user_writing_id, reject_message}) {
	const {data} = await http.post('writingApi/reject_submitted_writing', {
		reject_message,
		user_writing_id
	})
	return data
}

export async function getRejectHistory ({tutor_group_id, day_id, child_id}) {
	const {data} = await http.post('writingApi/list_reject_history', {
		tutor_group_id,
		day_id,
		child_id
	})
	return data
}

export async function getWritingMarks (user_writing_id, _fetch) {
	const {data} = await http.post('writingApi/get_student_writing_submission', {
		user_writing_id
	}, _fetch)
	let marking_category = ['content', 'organizations', 'sentence', 'vocabulary', 'language']
	marking_category = marking_category.map(cat => ({
		title: cat,
		max_mark: data[`${cat}_mark_max`],
		user_mark: data[`${cat}_mark`],
		comments: data.comments[cat]
	}))
	marking_category = marking_category.filter(cat => cat.max_mark > 0)
	return {
		marking_category,
		user_handwriting_images: data.images,
		overall_msg: data.overall_msg
	}
}