import {http} from "$lib/http";
import {tutor_group_store, updated_wrapper_id_store} from "../store";

export async function fetchZoomOverview ({start_date, end_date}, _fetch) {
	try {
		const {data} = await http.post(_fetch, '/zoomApi/zoom_list_all', {
			start_date, end_date
		})
		tutor_group_store.saveOverallZoomList(data)
		return data
	} catch (e) {}
}

export async function getStudentZoomList (tutor_group_id, child_id, _fetch) {
	try {
		const {data} = await http.post(_fetch,'/zoomApi/zoom_list', {
			tutor_group_id,
			child_id
		})
		tutor_group_store.saveTutorGroupZoomList(tutor_group_id, data)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function getZoomDetails (wrapper_id, _fetch) {
	try {
		const {data} = await http.post(_fetch,'/zoomApi/zoom_detail', {
			wrapper_id
		})
		tutor_group_store.saveZoomDetails(wrapper_id, data)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function addMaterialToZoom (_fetch, {item_id, tutor_group_id, wrapper_id, start_time}) {
	await http.post(_fetch,'/organizationApi/purchase_work_task', {
		item_ids: [item_id],
		tutor_group_id,
		wrapper_id,
		start_time,
		type_key: "reading-pdf"
	})
	await getZoomDetails(wrapper_id)
	updated_wrapper_id_store.set(wrapper_id)
}

export async function removeMaterialFromZoom (_fetch, {wrapper_id, day_ids}) {
	await http.post(_fetch,'/zoomApi/update_zoom_day_task', {
		wrapper_id,
		day_ids
	})
	await getZoomDetails(wrapper_id)
	updated_wrapper_id_store.set(wrapper_id)
}

export async function getZoomMaterialHistory (_fetch, child_id) {
	const {data} = await http.post(_fetch, '/zoomApi/get_child_material_list', {
		child_id
	})
	return data
}

export async function fetchTutorSalary (_fetch, teacher_id) {
	const {data} = await http.post(_fetch,'/zoomApi/list_tutor_salary', {
		teacher_id
	})
	return data
}

export async function fetchZoomRatingList (_fetch, teacher_id) {
	const {data} = await http.post(_fetch,'/zoomApi/list_unmark_zoom_difficulty', {
		teacher_id
	})
	return data
}

export async function markZoomRating (_fetch, {student_id, item_id, t_difficulty_rate}) {
	const {data} = await http.post(_fetch,'/zoomApi/set_zoom_material_rating', {
		student_id, item_id, t_difficulty_rate
	})
	return data
}

export async function getZoomMaterialRating (_fetch, {student_id, item_id}) {
	const {data} = await http.post(_fetch,'/zoomApi/get_zoom_material_rating', {
		student_id, item_id
	})
	return data
}