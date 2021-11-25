import {http} from "$lib/http";
import {tutor_group_store, org_store} from '../store'
import {get} from 'svelte/store'

export async function getUserOrgData (_fetch) {
	try {
		const {data} = await http.get(_fetch,'/organizationApi/user_organization_data_v2')
		tutor_group_store.saveList(data[0].tutor_group_without_classes)
		tutor_group_store.saveOOOList(data[0].one_on_one)
		tutor_group_store.saveClassList(data[0].classes)
		org_store.set(data[0].organization)
		return data[0]
	} catch (e) {
		console.log(e)
	}
}

export async function getTutorGroupLessonList (tutor_group_id, _fetch, options) {
	const use_cache = options && options.use_cache
	try {
		const tg = get(tutor_group_store).tutor_group[tutor_group_id]
		const tg_lesson = tg && tg.lessons
		if (tg_lesson && use_cache) return console.log('/get_tutor_group_lesson_list use cache')
		const {data} = await http.post(_fetch,'/courseApi/get_tutor_group_lesson_list', {
			tutor_group_id
		})
		const res2 = await http.post(_fetch,'/tutorApi/list_lesson_report_by_tutor_group_id', {
			tutor_group_id
		})
		let lessons = data
		lessons.forEach(lesson => {
			let object = res2.data.find(l => l.day_id === lesson.day_id)
			if (object && object.not_completed_users) {
				object.not_completed_users.forEach(s => s.completed = false)
				object.completed_users.forEach(s => s.completed = true)
				lesson.students = [...object.not_completed_users, ...object.completed_users]
				lesson.not_completed_users  = object.not_completed_users
				lesson.completed_users = object.completed_users
				lesson.completed_count = object.completed_users.length
				lesson.total_count = object.completed_users.length + object.not_completed_users.length
				lesson.assignment.forEach(a => {
					let s = lesson.students.find(s => s.user_id === a.user_id)
					if (s) {
						s.status = a.status
						s.user_writing_id = a.user_writing_id // for writing
						s.result_id = a.result_id // for grammar
						s.identifier = a.identifier // for grammar
					}
				})
			}
		})
		tutor_group_store.saveTutorGroupLesson(tutor_group_id, lessons)
		return {tutor_group_lesson_list: lessons}
	} catch (e) {
		console.log(e)
	}
}

export async function getStudentLessonList (tutor_group_id, child_id, _fetch, options) {
	const use_cache = options && options.use_cache
	try {
		const tg = get(tutor_group_store).tutor_group[tutor_group_id]
		const tg_lesson = tg && tg.lessons
		if (tg_lesson && use_cache) return console.log('get_tutor_group_lesson_list use cache')
		const {data} = await http.post(_fetch,'/tutorApi/get_tutor_course_by_id', {
			tutor_group_id,
			child_id
		})
		tutor_group_store.saveTutorGroupLesson(tutor_group_id, data)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function getTutorGroupStudentList (tutor_group_id, _fetch) {
	try {
		const {data} = await http.post('tutorApi/list_user_by_tutor_group_id', {
			tutor_group_id
		}, _fetch)
		tutor_group_store.saveTutorGroupStudents(tutor_group_id, data.students)
		return {tutor_group_student_list: data.students}
	} catch (e) {
		console.log(e)
	}
}

export async function getTutorGroupItemList ({tutor_group_id, category}, _fetch) {
	try {
		const {data} = await http.post('organizationApi/get_tutor_group_item_list', {
			tutor_group_id,
			category_tag_type: category,
			task_type: "reading-pdf"
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function fetchTutorAvailableTimeSlot (_fetch) {
	try {
		const {data} = await http.post('tutorApi/list_available_timeslot', {}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setTutorAvailableTimeSlot ({start_time, end_time, timeslot, timeslot_id}, _fetch) {
	try {
		const {data} = await http.post('tutorApi/set_available_time', {
			start_time, end_time, timeslot, timeslot_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function deleteTutorAvailableTimeSlot ({timeslot_id}, _fetch) {
	try {
		const {data} = await http.post('tutorApi/delete_available_timeslot', {
			timeslot_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}