import {writable, derived} from 'svelte/store'
import http from '../http'

export const user = writable('')
export const is_admin = derived(user, $user => $user ? $user.userGroup.id === "1" : false)

export async function getUserInfo () {
	try {
		const {data} = await http.get('userApi/user_info')
		return data && data[0]
	} catch (e) {}
}

export async function login (body) {
	try {
		const {data} = await http.post('userApi/login', body)
		return data[0]
	} catch (e) {
		return Promise.reject(e)
	}
}

export async function logout (_fetch) {
	try {
		await http.post('userApi/logout', {}, _fetch)
	} catch (e) {
		return Promise.reject(e)
	}
}

export async function fetchUserNote ({student_id}, _fetch) {
	try {
		let {data} = await http.post('userApi/get_user_reminder', {
			student_id
		}, _fetch)
		return data.reminder
	} catch (e) {
		return Promise.reject(e)
	}
}

export async function setUserNote ({student_id, message}, _fetch) {
	try {
		return await http.post('userApi/set_user_reminder', {
			student_id,
			reminder: message
		}, _fetch)
	} catch (e) {
		return Promise.reject(e)
	}
}

