import {usermodel} from "$lib/usermodal";

export const get = async (req) => {
	const {body, status} = await usermodel(req, `/writingApi/get_user_writing?id=${req.query.get('identifier')}`)
	const data = body.data

	let legacy_data = data[0].revised_result
	let new_data = data[0].extra_json
	let content = new_data ? new_data : parseLegacyData(legacy_data)
	let {para, edit_log, comments} = content
	const result = {
		para,
		edit_log,
		comments,
		title: data[0].title,
		writing_id: data[0].id
	}
	return {
		status,
		body: {
			success: true,
			data: result
		}
	}
}

function parseLegacyData (data) {
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