import {tutor_group_store} from "../../store"
import {get} from 'svelte/store'

export const genTimeOptions = () => {
	let options = []
	let hours = [12,1,2,3,4,5,6,7,8,9,10,11]
	let mins = ['00', '15', '30', '45']
	let ampm = ['am', 'pm']
	ampm.forEach(a => {
		hours.forEach(h => {
			mins.forEach(min => {
				let value_h = h
				let label_h = h
				if (value_h === 12) value_h = 0
				if (a === 'pm') value_h += 12
				value_h = String(value_h).padStart(2, '0')
				options.push({
					value: `${value_h}:${min}:00`,
					label: `${label_h}:${min}${a}`
				})
			})
		})
	})
	return options
}

export const genRepeatOptions = () => {
	let options = []
	const arr = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
	arr.forEach(i => {
		options.push({
			label: i,
			value: i
		})
	})
	options.unshift({
		label: "1 (no recurrent)",
		value: 1
	})
	return options
}

export const reminder_options = [
	{
		value: 15,
		label: '15 minutes before'
	},
	{
		value: 30,
		label: '30 minutes before'
	},
	{
		value: 45,
		label: '45 minutes before'
	},
	{
		value: 60,
		label: '60 minutes before'
	},
	{
		value: 120,
		label: '120 minutes before'
	}
]

export const duration_options = [
	{
		label: '30 minutes',
		value: 30
	},
	{
		label: '40 minutes',
		value: 40
	},
	{
		label: '60 minutes',
		value: 60
	},
	{
		label: '90 minutes',
		value: 90
	},
	{
		label: '120 minutes',
		value: 120
	}
]

export const genStudentOptions = () => {
	let options = []
	get(tutor_group_store).o_o_o_list.forEach(ooo => {
		options.push({
			image: ooo.avatar_filepath,
			label: `${ooo.nickname}`,
			value: ooo.user_id,
			tutor_groups: ooo.tutor_groups
		})
	})
	return options
}

export const titleOptions = [
	'Reading and speaking class',
	'Creative writing class',
	'Story telling class',
	'Exam preparation and skills training class'
]