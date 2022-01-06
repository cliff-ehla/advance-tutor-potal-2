import dayjs from "dayjs";

export const eventContent = (arg) => {
	let zoom = arg.event.extendedProps
	let title_el = document.createElement('i')
	let time_el = document.createElement('b')
	time_el.innerHTML = dayjs(arg.event.start).format('h:mma')
	time_el.style.paddingRight = '2px'
	time_el.setAttribute("id", 'wrapper_' + zoom.wrapper_id)

	title_el.innerHTML = arg.event.title
	let student_count = zoom.students.length
	let big_classroom_type = zoom.big_classroom_type
	const is_classroom = !!big_classroom_type
	let is_big_class = ['UNLIMITED', 'BIG'].includes(big_classroom_type)
	let is_small_class = big_classroom_type === 'SMALL'
	if (is_classroom) {
		title_el.innerHTML = zoom.sub_cat
	} else if (student_count > 1) {
		title_el.innerHTML = `${student_count} students`
	} else {
		title_el.innerHTML = arg.event.title || '(no title)'
	}

	let wrapper_el = document.createElement('div')
	wrapper_el.classList.add('inline-flex', 'items-center', 'cursor-pointer', 'overflow-hidden', 'text-white', 'rounded-sm')
	wrapper_el.classList.add(is_classroom ? 'bg-purple-500' : 'bg-blue-500')
	wrapper_el.appendChild(time_el)
	wrapper_el.appendChild(title_el)

	let is_before = dayjs(arg.event.start).isBefore(dayjs())
	let is_after = dayjs(arg.event.start).isAfter(dayjs())
	let have_material = zoom.days.length > 0

	if (is_after && !have_material) {
		let alert_el = document.createElement('span')
		alert_el.innerHTML = '<svg x="0px" y="0px" viewBox="0 0 36 36" class="w-4 fill-current"><path d="M35.113 27.58L21.796 4.6c-2.07-3.578-5.467-3.58-7.543-.004L.89 27.586c-2.077 3.574-.394 6.498 3.74 6.498h26.736c4.133 0 5.82-2.926 3.747-6.504zm-16.966 2.456c-1.28 0-2.3-1.02-2.3-2.3s1.02-2.298 2.3-2.298c1.28 0 2.298 1.02 2.298 2.3s-1.018 2.298-2.298 2.298zm1.628-6.053h-3.258L15.42 10.717h5.453l-1.098 13.266z"></path></svg>'
		alert_el.style.paddingRight = '2px'
		alert_el.style.color = 'red'
		wrapper_el.prepend(alert_el)
	}

	if (is_before && have_material && student_count === 1) {
		let rate_el = document.createElement('span')

		if (zoom.t_difficulty_rate_has_rate) {
			rate_el.innerHTML = '<svg class="w-4 fill-current" viewBox="0 0 36 36"><path d="M18 0C8.06 0 0 8.06 0 18s8.06 18 18 18 18-8.06 18-18S27.94 0 18 0zm-2.416 29L6 19.416l2.875-2.875 6.71 6.71 10.54-13.417L29 12.708 15.584 29z"></path></svg>'
			rate_el.classList.add('text-green-500')
		} else {
			rate_el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="w-4 fill-current"><circle cx="18" cy="18" r="13.125"></circle><path d="M18 0C8.075 0 0 8.075 0 18c0 9.926 8.075 18 18 18s18-8.074 18-18c0-9.925-8.075-18-18-18zm0 33.75C9.314 33.75 2.25 26.686 2.25 18 2.25 9.315 9.314 2.25 18 2.25S33.75 9.315 33.75 18c0 8.686-7.064 15.75-15.75 15.75z"></path></svg>'
			rate_el.classList.add('text-red-500')
		}
		rate_el.style.paddingRight = '2px'
		wrapper_el.prepend(rate_el)
	}

	return { domNodes: [wrapper_el] }
}