import dayjs from "dayjs";
import tippy from "tippy.js";
import {capitalize} from "$lib/helper/capitalize.js";
import {tooltip} from "$lib/aciton/tooltip.js";

export const eventContent = (arg) => {
	let zoom = arg.event.extendedProps
	let title_el = document.createElement('i')
	let time_el = document.createElement('div')
	time_el.innerHTML = dayjs(arg.event.start).format('h:mma')
	time_el.setAttribute("id", 'wrapper_' + zoom.wrapper_id)
	time_el.classList.add('mr-1', 'font-bold', 'text-xs')

	let student_count = zoom.students.length
	let big_classroom_type = zoom.big_classroom_type
	const is_classroom = !!big_classroom_type
	const is_cancel = zoom.is_cancel
	const rated = zoom.t_difficulty_rate_has_rate
	const is_trial = zoom.is_trial

	let wrapper_el = document.createElement('div')
	wrapper_el.classList.add('p-0.5', 'flex', 'items-center', 'cursor-pointer', 'overflow-hidden', 'rounded-sm', 'w-full')
	if (is_classroom) {
		// background is classroom class
		wrapper_el.classList.add('bg-purple-700', 'hover:bg-purple-500', 'text-white')
	} else {
		// background of trial vs standard class
		if (is_trial) {
			wrapper_el.classList.add('bg-green-600', 'hover:bg-green-500')
		} else {
			wrapper_el.classList.add('bg-blue-700', 'hover:bg-blue-800')
		}
		// cancel display dim text, otherwise sharp white text
		wrapper_el.classList.add(is_cancel ? 'text-gray-400' : 'text-white')
	}
	wrapper_el.appendChild(time_el)


	let is_before = dayjs(arg.event.end).isBefore(dayjs())

	if (is_classroom) {
		let lv_el = document.createElement('div')
		lv_el.innerHTML = capitalize(zoom.rc_level)
		lv_el.classList.add('overflow-hidden', 'whitespace-nowrap', 'px-0.5', 'text-xs', 'bg-purple-500', 'hover:bg-gray-800', 'text-white', 'ml-auto', 'leading-tight')
		lv_el.style.maxWidth = '40px'
		tippy(lv_el, {content: zoom.rc_level})
		let code_el = document.createElement('div')
		code_el.innerHTML = zoom.description_code_short_id
		code_el.classList.add('overflow-hidden', 'px-0.5', 'text-xs', 'bg-purple-500', 'hover:bg-gray-800', 'text-white', 'ml-0.5', 'leading-tight')
		tippy(code_el, {content: zoom.sub_cat})
		let size_el = document.createElement('div')
		size_el.classList.add('bg-yellow-600', 'text-white', 'px-0.5' , 'leading-tight', 'text-xs', 'ml-0.5')
		size_el.innerHTML = `${zoom.reg_user_cnt}/${zoom.student_size}`
		wrapper_el.append(lv_el)
		wrapper_el.append(code_el)
		wrapper_el.append(size_el)
	} else {
		title_el.innerHTML = arg.event.title
		if (student_count > 1) {
			title_el.innerHTML = `${student_count} students`
		} else {
			title_el.innerHTML = arg.event.title || '(no title)'
		}
		title_el.classList.add('text-xs', 'whitespace-nowrap')
		wrapper_el.appendChild(title_el)
		if (!rated && is_before && !is_cancel && !is_trial) {
			let rate_el = document.createElement('span')
			rate_el.classList.add('w-2', 'h-2', 'rounded-full' , 'bg-pink-500', 'border-white', 'border', 'flex-shrink-0', 'mr-1')
			tooltip(rate_el, 'No rating')
			wrapper_el.prepend(rate_el)
		}
	}

	return { domNodes: [wrapper_el] }
}