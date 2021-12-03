import {writable, derived, get} from 'svelte/store'
import { normalize, denormalize , schema } from 'normalizr'
import updateEntities from './update-entities'
import {tutor_group_store} from "./index";
import dayjs from "dayjs";

const tutor_group_schema = new schema.Entity('tutor_group', {}, {idAttribute: 'tutor_group_id'})
const tutor_group_list_schema = [tutor_group_schema]
const o_o_o_schema = new schema.Entity('o_o_o', {
	tutor_groups: [tutor_group_schema]
}, {
	idAttribute: 'user_id'
})
const o_o_o_list_schema = [o_o_o_schema]
const classes_schema = new schema.Entity('o_o_o', {
	tutor_groups: [tutor_group_schema]
}, {
	idAttribute: 'c_id'
})
const classes_list_schema = [classes_schema]

const zoom_schema = new schema.Entity('zoom', {}, {idAttribute: 'wrapper_id'})
const zoom_list_schema = [zoom_schema]

const tutor_group = () => {
	const store = writable({
		entity: {
			tutor_group: {},
			o_o_o: {},
			zoom: {}
		},
		tutor_group_ids: [],
		o_o_o_ids: [],
		class_ids: [],
		overall_zoom_ids: null
	})

	const d_store = derived(store, $store => ({
		tutor_group_list: denormalize($store.tutor_group_ids, tutor_group_list_schema, $store.entity),
		o_o_o_list: denormalize($store.o_o_o_ids, o_o_o_list_schema, $store.entity),
		class_list: denormalize($store.class_ids, classes_list_schema, $store.entity),
		overall_zoom_list: $store.overall_zoom_ids ? denormalize($store.overall_zoom_ids, zoom_list_schema, $store.entity) : null,
		tutor_group: $store.entity.tutor_group || {},
		entity: $store.entity
	}))

	const saveList = (list) => {
		const {entities, result} = normalize(list, tutor_group_list_schema)
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, entities),
			tutor_group_ids: result
		}))
	}

	const saveOOOList = (list) => {
		const {entities, result} = normalize(list, o_o_o_list_schema)
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, entities),
			o_o_o_ids: result
		}))
	}

	const saveClassList = (list) => {
		const {entities, result} = normalize(list, classes_list_schema)
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, entities),
			class_ids: result
		}))
	}

	const saveTutorGroupLesson = (tutor_group_id, lessons) => {
		const new_dict = {
			tutor_group: {
				[tutor_group_id]: {
					lessons
				}
			}
		}
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, new_dict)
		}))
	}

	const saveTutorGroupZoomList = (tutor_group_id, zoom_list) => {
		const {entities, result} = normalize(zoom_list, zoom_list_schema)
		entities.tutor_group = {
			[tutor_group_id]: {
				wrapper_ids: result
			}
		}
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, entities)
		}))
	}

	const saveOverallZoomList = (zoom_list) => {
		const {entities, result} = normalize(zoom_list, zoom_list_schema)
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, entities),
			overall_zoom_ids: result
		}))
	}

	const saveZoomDetails = (wrapper_id, zoom) => {
		const entities = {
			zoom: {
				[wrapper_id]: zoom
			}
		}
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, entities)
		}))
	}

	const saveTutorGroupStudents = (tutor_group_id, students) => {
		const new_dict = {
			tutor_group: {
				[tutor_group_id]: {
					students
				}
			}
		}
		store.update(v => ({
			...v,
			entity: updateEntities(v.entity, new_dict)
		}))
	}

	const getOOO = (user_id) => {
		return denormalize(user_id, o_o_o_schema, get(store).entity)
	}

	const getClass = (c_id) => {
		return denormalize(c_id, classes_schema, get(store).entity)
	}

	const getClassName = (c_id) => {
		let c = getClass(c_id)
		return c && c.name
	}

	const getZoomList = (tutor_group_id) => {
		const tg = get(store).entity.tutor_group[tutor_group_id]
		const ids = tg ? tg.wrapper_ids : null
		return ids ? denormalize(ids, zoom_list_schema, get(store).entity) : null
	}

	const getTutorGroup = (tutor_group_id) => {
		return get(store).entity.tutor_group[tutor_group_id]
	}

	/**
	 * flatten all the course from one on one
	 */
	const getAllCourse = () => {
		let students = get(d_store).o_o_o_list
		if (!students) return
		const results = []
		students.forEach(item => {
			item.tutor_groups.forEach(tg => {
				const expired = dayjs(tg.end_date).isBefore(dayjs())
				if (!expired) {
					results.push({
						...tg,
						...{
							student_name: item.nickname,
							student_id: item.user_id
						}
					})
				}
			})
		})
		return results
	}

	const deleteZoom = (wrapper_id) => {
		store.update(v => {
			let clone = v.overall_zoom_ids
			clone.splice(clone.indexOf(wrapper_id), 1)
			return {
				...v,
				...{
					overall_zoom_ids: clone
				}
			}
		})
	}

	return {
		subscribe: d_store.subscribe,
		saveList,
		saveOOOList,
		saveTutorGroupLesson,
		saveTutorGroupZoomList,
		saveTutorGroupStudents,
		getOOO,
		getClass,
		getClassName,
		getZoomList,
		saveZoomDetails,
		saveOverallZoomList,
		saveClassList,
		deleteZoom,
		getTutorGroup,
		getAllCourse
	}
}

export default tutor_group()