import dayjs from "dayjs";
import tippy from "tippy.js";

export const eventContent = (arg) => {
	let zoom = arg.event.extendedProps
	let title_el = document.createElement('i')
	let time_el = document.createElement('div')
	time_el.innerHTML = dayjs(arg.event.start).format('h:mma')
	time_el.setAttribute("id", 'wrapper_' + zoom.wrapper_id)
	time_el.classList.add('mr-1', 'font-bold' , 'text-xs')

	let student_count = zoom.students.length
	let big_classroom_type = zoom.big_classroom_type
	const is_classroom = !!big_classroom_type
	const is_cancel = zoom.is_cancel
	const rated = zoom.t_difficulty_rate_has_rate


	let wrapper_el = document.createElement('div')
	wrapper_el.classList.add('flex', 'items-center', 'cursor-pointer', 'overflow-hidden', 'rounded-sm', 'w-full')
	if (is_cancel) {
		wrapper_el.classList.add('text-gray-300')
	}
	// wrapper_el.classList.add(is_classroom ? 'bg-purple-500' : 'bg-blue-500')
	wrapper_el.appendChild(time_el)


	let is_before = dayjs(arg.event.start).isBefore(dayjs())

	if (is_classroom) {
		let code_el = document.createElement('div')
		code_el.innerHTML = zoom.description_code_short_id
		code_el.classList.add('overflow-hidden', 'px-1', 'text-xs', 'bg-gray-300', 'ml-auto', 'text-xs')
		let size_el = document.createElement('div')
		size_el.classList.add('bg-purple-500', 'text-white', 'px-1' , 'leading-tight', 'text-xs', 'ml-1')
		size_el.innerHTML = `${zoom.reg_user_cnt}/${zoom.student_size}`
		wrapper_el.append(code_el)
		wrapper_el.append(size_el)
	} else {
		title_el.innerHTML = arg.event.title
		if (student_count > 1) {
			title_el.innerHTML = `${student_count} students`
		} else {
			title_el.innerHTML = arg.event.title || '(no title)'
		}
		title_el.classList.add('text-xs')
		wrapper_el.appendChild(title_el)
		if (!rated && is_before && !is_cancel) {
			let rate_el = document.createElement('span')
			rate_el.classList.add('w-2', 'h-2', 'rounded-full' , 'bg-red-500', 'flex-shrink-0', 'mr-0.5')
			rate_el.style.paddingRight = '2px'
			wrapper_el.prepend(rate_el)
		}
	}

	return { domNodes: [wrapper_el] }
}