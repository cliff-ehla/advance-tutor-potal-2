import dayjs from "dayjs";
import tippy from "tippy.js";
import {capitalize} from "$lib/helper/capitalize.js";
import {tooltip} from "$lib/action/tooltip.js";
import {rc_level_to_label} from "$lib/store/rc-level-to-label.js";
import {rating_number_to_label} from "$lib/store/rating-number-to-label.js";

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
	const {is_cancel, s_sick_leave, t_sick_leave} = zoom
	const rated = zoom.t_difficulty_rate_has_rate
	const rating_score = zoom.days[0] && Number(zoom.days[0].t_difficulty_rate)
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
			wrapper_el.classList.add('bg-blue-800', 'hover:bg-blue-500')
		}
		// cancel display dim text, otherwise sharp white text
		wrapper_el.classList.add(is_cancel ? 'text-gray-400' : 'text-white')
	}
	wrapper_el.appendChild(time_el)


	let is_before = dayjs(arg.event.end).isBefore(dayjs())

	if (is_classroom) {
		let lv_el = document.createElement('div')
		const _lv = rc_level_to_label[zoom.rc_level] || zoom.rc_level
		lv_el.innerHTML = _lv
		lv_el.classList.add('overflow-hidden', 'whitespace-nowrap', 'px-0.5', 'text-xs', 'bg-purple-500', 'hover:bg-gray-800', 'text-white', 'ml-auto', 'leading-tight')
		lv_el.style.maxWidth = '40px'
		tippy(lv_el, {content: _lv})
		let code_el = document.createElement('div')
		code_el.innerHTML = zoom.description_code_short_id
		code_el.classList.add('overflow-hidden', 'px-0.5', 'text-xs', 'bg-purple-500', 'hover:bg-gray-800', 'text-white', 'ml-0.5', 'leading-tight')
		code_el.style.maxWidth = '40px'
		tippy(code_el, {content: zoom.sub_cat})
		let size_el = document.createElement('div')
		size_el.classList.add('bg-yellow-600', 'text-white', 'px-0.5' , 'leading-tight', 'text-xs', 'ml-0.5')
		size_el.innerHTML = `${zoom.reg_user_cnt}/${zoom.student_size}`
		wrapper_el.append(lv_el)
		wrapper_el.append(code_el)
		wrapper_el.append(size_el)
	} else {
		if (s_sick_leave) {
			title_el.innerHTML = 'Student leave'
		} else if (t_sick_leave) {
			title_el.innerHTML = 'My leave'
		} else if (is_cancel) {
			title_el.innerHTML = 'Canceled' // if canceled and is not t_sick or s_sick
		} else {
			title_el.innerHTML = arg.event.title
		}
		title_el.classList.add('text-xs', 'whitespace-nowrap')
		wrapper_el.appendChild(title_el)
		if (is_before && !is_cancel && !is_trial) {
			if (!rating_score) {
				let rate_el = document.createElement('span')
				rate_el.innerHTML = '<svg viewBox="0 0 36 36" class="mr-1 w-4 fill-current text-white"><path d="M36 13.958l-12.924-1.14L18 .883l-5.076 11.933L0 13.96l9.784 8.518-2.91 12.642L18 28.448l11.126 6.672-2.91-12.643L36 13.957zm-8.85 18.44l-8.474-5.08L18 26.91l-.68.406-8.47 5.08 2.216-9.627.178-.77-.595-.52-7.45-6.485 9.84-.87.788-.067.308-.726L18 4.245l3.866 9.087.31.726.787.07 9.84.87-7.45 6.484-.595.52.178.77L27.15 32.4z"></path></svg>'
				tooltip(rate_el, 'No rating')
				wrapper_el.prepend(rate_el)
			} else if (rating_score > 0) {
				let rate_el = document.createElement('span')
				if (rating_score === 1 || rating_score === 5) {
					rate_el.innerHTML = '<svg class="mr-1 w-4 fill-current" viewBox="0 0 36 36">\n' +
							'<path d="M7.318 1C4.30489 1 1 3.66644 1 5.97828V12.9405C1 15.5716 2.05444 17.1771 4.35328 17.1771C6.00933 17.1771 9.66883 17.0312 9.66883 17.0312L9.37994 21.5451C9.37994 24.3054 9.90428 25.5556 11.4036 25.5556C13.2626 25.5556 12.5108 23.2964 13.1131 21.3414C13.714 19.3827 16.9582 15.4444 19.304 15.4444H19.7778V3.88744C16.4628 3.88744 16.4137 1 13.4172 1H7.318ZM25.7144 3.88889H21.2222V15.4444H25.7506C26.6844 15.4444 27 14.7352 27 14.1228V5.27556C27 4.41972 26.5869 3.88889 25.7144 3.88889Z"/>\n' +
							'<path d="M22.374 19C20.288 19 18 20.846 18 22.4465V27.2665C18 29.088 18.73 30.1995 20.3215 30.1995C21.468 30.1995 24.0015 30.0985 24.0015 30.0985L23.8015 33.2235C23.8015 35.1345 24.1645 36 25.2025 36C26.4895 36 25.969 34.436 26.386 33.0825C26.802 31.7265 29.048 29 30.672 29H31V20.999C28.705 20.999 28.671 19 26.5965 19H22.374ZM35.11 21H32V29H35.135C35.7815 29 36 28.509 36 28.085V21.96C36 21.3675 35.714 21 35.11 21Z"/>\n' +
							'</svg>'
				} else if (rating_score === 2 || rating_score === 4) {
					rate_el.innerHTML = '<svg viewBox="0 0 36 36" class="mr-1 w-3.5 fill-current"><path d="M8.748 1C4.576 1 0 4.692 0 7.893v9.64c0 3.643 1.46 5.866 4.643 5.866 2.293 0 7.36-.202 7.36-.202l-.4 6.25c0 3.822.726 5.553 2.802 5.553 2.574 0 1.533-3.128 2.367-5.835.832-2.712 5.324-8.165 8.572-8.165H26V4.998C21.41 4.998 21.342 1 17.193 1H8.748zM34.22 5H28v16h6.27c1.293 0 1.73-.982 1.73-1.83V6.92C36 5.735 35.428 5 34.22 5z"></path></svg>'
				} else  if (rating_score === 3) {
					rate_el.innerHTML = '<svg viewBox="0 0 36 36" class="mr-1 w-3.5 fill-current"><path d="M31.357 12.602c-2.293 0-7.36.2-7.36.2l.4-6.25c0-3.822-.725-5.552-2.8-5.552-2.575 0-1.534 3.13-2.368 5.836C18.395 9.546 13.903 15 10.655 15H10v16.002c4.59 0 4.658 3.998 8.807 3.998h8.445C31.424 35 36 31.308 36 28.107v-9.64c0-3.643-1.46-5.865-4.643-5.865zM0 16.83v12.25C0 30.265.572 31 1.78 31H8V15H1.73C.437 15 0 15.983 0 16.83z"></path></svg>'
				}
				const color_map = {
					1: 'text-yellow-300',
					2: 'text-yellow-300',
					3: 'text-green-400',
					4: 'text-red-500',
					5: 'text-red-500'
				}
				rate_el.classList.add(color_map[rating_score])
				tooltip(rate_el, rating_number_to_label[rating_score])
				wrapper_el.prepend(rate_el)
			}
		}
	}

	return { domNodes: [wrapper_el] }
}