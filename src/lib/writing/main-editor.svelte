<script>
	import {onMount, getContext, tick} from 'svelte'
	import EditPopup from './edit-popup.svelte'
	import EditComment from './edit-comment.svelte'
	import CommentSvg from './comment-svg.svelte'
	import {createEventDispatcher} from 'svelte'
	import {tooltip} from "$lib/action/tooltip.js";

	const dispatch = createEventDispatcher()
	const {open} = getContext('simple-popup')
	const SimpleModalFunction = getContext('simple-modal')
	const openModal = SimpleModalFunction.open

	export let para = []
	export let comments = []
	export let edit_log = []
	export let is_readonly = false
	export let text_editor_active = undefined

	let para_el
	let editor_el

	let cursor_idx = 0
	let para_idx = 0
	let cursor_el
	$: cursor_visible = !highlight_start_idx

	let highlight_start_idx
	let highlight_end_idx
	let mousedown_start_idx
	let is_mouse_drag = false
	$: computed_highlight_start_idx = highlight_end_idx < highlight_start_idx ? highlight_end_idx : highlight_start_idx
	$: computed_highlight_end_idx = highlight_end_idx < highlight_start_idx ? highlight_start_idx : highlight_end_idx
	$: comment_button_disabled = comments.some(c => {
		return c.pid === para_idx && c.start_wid === cursor_idx
	})

	let edit_start_idx
	let edit_end_idx
	let edit_type

	let comment_start_idx
	let comment_end_idx
	let active_comment_idx

	let active_button = null

	export let font_size = 24
	const max_font_size = 64
	const min_font_size = 16

	let is_mobile
	let long_press_timeout_id
	let is_long_press
	let wait_for_highlight_end

	let computed_para = JSON.parse(JSON.stringify(para))

	function numberRange (start, end) {
		return new Array(end - start).fill().map((d, i) => i + start);
	}

	$: {
		computed_para = JSON.parse(JSON.stringify(para))
		para.forEach(p => {
			p.forEach(w => {
				w.comment = false
				w.type = false
				w.amendment_type = null
			})
		})
		edit_log.forEach(log => {
			let words = para[log.pid].slice(log.start_wid, log.end_wid || log.start_wid + 1)
			words.forEach(w => {
				w.amendment_type = log.type
			})
		})
		edit_log.forEach(log => {
			const {start_wid, end_wid, pid, text} = log
			let _end_wid = end_wid || start_wid // insert has no end_wid
			let idx = computed_para[pid].findIndex(w => w.wid === _end_wid)
			if (text) { // cross out without adding words
				computed_para[pid].splice(idx, 0, {
					red_word: true,
					text,
					words: text.split(' ').map(w => ({
						word: w,
						start_wid,
						end_wid,
						pid
					}))
				})
			}
		})
		comments.forEach(c => {
			let words = para[c.pid].slice(c.start_wid, c.end_wid)
			words.forEach(w => {
				w.comment = true
			})
		})
		computed_para = computed_para
		dispatch('update', {
			comments,
			edit_log,
			para
		})
	}

	$: {
		if (cursor_idx >= 0) {
			getCrossover()
			getActiveComment()
		}
	}

	let highlighted_amendments = []
	$: {
		let result = []
		edit_log.forEach(log => {
			let start = log.start_wid > log.end_wid ? log.end_wid : log.start_wid
			let end = log.start_wid > log.end_wid ? log.start_wid : log.end_wid
			let is_in_current_para = log.pid === para_idx
			let arr_1 = is_in_current_para ? (start !== null && end) ? numberRange(start, end) : start !== null ? [start] : [] : []
			let arr_2 = (computed_highlight_start_idx && computed_highlight_end_idx) ? numberRange(computed_highlight_start_idx, computed_highlight_end_idx) : highlight_start_idx ? [computed_highlight_start_idx] : []
			result = [...result, ...arr_1.filter(v => arr_2.includes(v))]
		})
		highlighted_amendments = result
	}

	$: {
		if (font_size) {
			setTimeout(updateAbsolutePositionElements, 10)
		}
	}

	$: is_any_next_para_symbol = edit_log.some(log => log.type === 'next-paragraph')

	const getCrossover = () => {
		let any_hint = false
		edit_log.forEach(w => {
			const is_in_current_para = w.pid === para_idx
			let is_hit
			if (is_in_current_para) {
				is_hit = w.type === 'add' || w.type === 'next-paragraph' ?
					cursor_idx === w.start_wid :
					cursor_idx >= w.start_wid && cursor_idx <= w.end_wid
			} else {
				is_hit = false
			}
			if (is_hit && !highlight_start_idx) {
				edit_start_idx = w.start_wid
				edit_end_idx = w.end_wid
				edit_type = w.type
				any_hint = true
			}
		})
		if (!any_hint) {
			clearEditHighlight()
		}
	}

	const getActiveComment = () => {
		let any_hint = false
		comments.forEach((c,i) => {
			const is_hit = cursor_idx >= c.start_wid && cursor_idx <= c.end_wid
			if (is_hit) {
				comment_start_idx = c.start_wid
				comment_end_idx = c.end_wid
				active_comment_idx = i
				any_hint = true
			}
		})
		if (!any_hint) {
			clearCommentHighlight()
		}
	}

	const isSymbol = w => {
		return w.wording.match(/[\?\.,;!¡¿。、·']/)
	}

	const getPosition = (node, word_log) => {
		const locate = (_word_log) => {
			let selector = `[data-wid='${_word_log.start_wid}'][data-pid='${_word_log.pid}']`
			let target = document.querySelector(selector)
			if (!target) return console.warn('getPosition: cannot find element with selector: ' + selector)
			const {left, top} = target.getBoundingClientRect()
			node.style.left = left + 'px'
			node.style.top = top - 10 + document.documentElement.scrollTop + 'px'
		}
		locate(word_log)
		return {
			update: (updated_word_log) => {
				locate(updated_word_log)
			}
		}
	}

	const onkeydown = e => {
		if (!text_editor_active) return
		if (is_readonly) return
		if (active_button) return
		const code = e.keyCode
		const is_nav = [37,39,38,40].includes(code)
		const is_shift_nav = is_nav && e.shiftKey
		if (is_shift_nav) {
			if (highlight_start_idx === null) {
				highlight_start_idx = cursor_idx
			}
		} else if (is_nav) {
			clearHighlight()
		}
		if (code === 37) { // left
			if (cursor_idx > 0) {
				cursor_idx--
			} else if (cursor_idx === 0 && para_idx > 0) {
				para_idx--
				cursor_idx = para[para_idx].length - 1
			}
		} else if (code === 39) { // right
			if (cursor_idx < para[para_idx].length - 1) {
				cursor_idx++
			} else if (para_idx < para.length - 1) {
				para_idx++
				cursor_idx = 0
			}
		} else if (code === 38) { // up
			e.preventDefault()
			let {left, top} = cursor_el.getBoundingClientRect()
			let word_el = document.querySelector(`[data-wid='${cursor_idx}'][data-pid='${para_idx}']`)
			seekBackward(word_el, {left, top})
		} else if (code === 40) { // down
			e.preventDefault()
			let {left, top} = cursor_el.getBoundingClientRect()
			let word_el = document.querySelector(`[data-wid='${cursor_idx}'][data-pid='${para_idx}']`)
			seekForward(word_el, {left, top})
		} else if (code === 8) { // delete
			if (highlighted_amendments.length) {
				undoMultipleAmendments()
			} else if (edit_start_idx !== null && edit_start_idx >= 0) {
				onUndo()
			} else if (highlight_start_idx || highlight_start_idx === 0) {
				deletedSelection()
			}
		} else if (code === 13) { // enter
			if (edit_type ? edit_type === 'add' : !highlight_start_idx) {
				e.preventDefault()
				showPopup('edit')
			} else if (edit_type ? edit_type === 'correction' : !!highlight_start_idx) {
				e.preventDefault()
				showPopup('edit')
			}
		} else if (code >= 65 && code <= 90) { // a - z
			if (e.shiftKey && code === 67) {
				e.preventDefault()
				return showPopup('comment')
			}
			if (!highlighted_amendments.length) {
				if (!edit_type && highlight_start_idx === null) {
					showPopup('add')
				} else if (highlight_start_idx !== null && edit_start_idx === null) {
					showPopup('correction')
				}
			}
		}
		if (is_shift_nav) {
			highlight_end_idx = cursor_idx
		}
	}

	const getMouseCursorIdx = e => {
		let target = e.target.closest('.word')
		let real_target
		if (target) {
			let {left, width} = target.getBoundingClientRect()
			let mid_point = left + width / 2
			let is_end = e.clientX > mid_point
			real_target = is_end ? target.nextElementSibling : target
		}
		return real_target ? Number(real_target.getAttribute('data-wid')) : null
	}

	const getMouseParaIdx = e => {
		let target = e.target.parentElement
		const is_word = target.classList.contains('word')
		return is_word ? Number(target.getAttribute('data-pid')) : null
	}

	const onMouseDown = e => {
		if (is_mobile) { // the mechanic to do highlight for mobile version
			// when the selection step is in progress, the next click is to highlight the end
			if (wait_for_highlight_end) {
				highlight_end_idx = getMouseCursorIdx(e) + 1
				is_long_press = true // just to tell mouseup to do nothing
				wait_for_highlight_end = false
				return
			} else {
				long_press_timeout_id = setTimeout(() => {
					is_long_press = true
					wait_for_highlight_end = true
					highlight_start_idx = getMouseCursorIdx(e)
					highlight_end_idx = getMouseCursorIdx(e) + 1
				}, 200)
			}
		}
		if (getMouseParaIdx(e)) {
			para_idx = getMouseParaIdx(e)
		}
		highlight_start_idx = null
		highlight_end_idx = null
		let idx = getMouseCursorIdx(e)
		if (idx || idx === 0) mousedown_start_idx = idx
	}

	const onMouseMove = e => {
		if (mousedown_start_idx || mousedown_start_idx === 0) {
			is_mouse_drag = true
			highlight_start_idx = mousedown_start_idx
			highlight_end_idx = getMouseCursorIdx(e) + 1
		}
	}

	const onMouseUp = e => {
		if (is_mobile) clearTimeout(long_press_timeout_id)
		if (is_long_press) {
			is_long_press = false
		} else if (is_mouse_drag) {
			is_mouse_drag = false
		} else {
			highlight_start_idx = null
			highlight_end_idx = null
			let idx = getMouseCursorIdx(e)
			if (idx || idx === 0) {
				cursor_idx = getMouseCursorIdx(e)
			}
		}
		mousedown_start_idx = null
	}

	const seekForward = (el, anchor) => {
		let next_el = el.nextElementSibling
		if (!next_el) {
			if (para_idx < para.length - 1) {
				next_el = el.parentElement.nextElementSibling.firstElementChild
				para_idx++
			} else {
				return cursor_idx = para[para_idx].length - 1
			}
		}
		const is_not_red_word = !next_el.hasAttribute('data-red-word')
		const {left, top} = next_el.getBoundingClientRect()
		const is_next_line = top > anchor.top
		const is_left = left > anchor.left
		if (is_next_line && is_left && is_not_red_word) {
			cursor_idx = Number(next_el.getAttribute('data-wid'))
		} else if (next_el) {
			seekForward(next_el, anchor)
		}
	}

	const seekBackward = (el, anchor) => {
		let next_el = el.previousElementSibling
		if (!next_el) {
			if (para_idx > 0) {
				next_el = el.parentElement.previousElementSibling.lastElementChild
				para_idx--
			} else {
				return cursor_idx = 0
			}
		}
		const is_not_red_word = !next_el.hasAttribute('data-red-word')
		const {left, top} = next_el.getBoundingClientRect()
		const is_prev_line = top < anchor.top
		const is_left = left < anchor.left
		if (is_prev_line && is_left && is_not_red_word) {
			cursor_idx = Number(next_el.getAttribute('data-wid'))
		} else if (next_el) {
			seekBackward(next_el, anchor)
		}
	}

	const showPopup = (type) => {
		if (!type) return console.warn('showPopup: missing "type" param')
		active_button = type
		let text
		let activator_rect
		let title = {
			correction: 'Edit',
			add: 'Insert',
			comment: 'Comment'
		}[active_button]
		if (active_button === 'edit') {
			const is_correction = !!edit_end_idx
			activator_rect = is_correction ? getBoundRectFromRangeOfWords(edit_start_idx, edit_end_idx) : cursor_el.getBoundingClientRect()
			let log = edit_log.find(w => w.start_wid === edit_start_idx)
			if (!log) return console.warn('show "edit" popup: cannot find log')
			text = log.text
		} else {
			let is_highlight = !!computed_highlight_end_idx
			if (is_highlight) {
				activator_rect = getBoundRectFromRangeOfWords(computed_highlight_start_idx, computed_highlight_end_idx)
			} else {
				activator_rect = cursor_el.getBoundingClientRect()
			}
		}
		open(EditPopup, activator_rect, {
			onConfirm: (text) => {
				if (active_button === 'correction') {
					edit_start_idx = highlight_start_idx
					edit_end_idx = highlight_end_idx
				} else if (active_button === 'add') {
					edit_start_idx = cursor_idx
				}

				if (active_button === 'correction') createEditWords(text)
				else if (active_button === 'comment') createComment(text)
				else if (active_button === 'add') createAdditionWords(text)
				else if (active_button === 'edit') updateEditing(text)
				getCrossover()
			},
			text,
			title
		}, {
			width: activator_rect.width
		}, {
			onClose: () => {
				active_button = null
			}
		})
	}

	const getBoundRectFromRangeOfWords = (wid_1, wid_2) => {
		let total_width = 0
		numberRange(wid_1,wid_2).forEach(wid => {
			let el = document.querySelector(`[data-wid='${wid}']`)
			total_width += el.getBoundingClientRect().width
		})
		const el1 = document.querySelector(`[data-wid='${wid_1}'][data-pid='${para_idx}']`)
		const el2 = document.querySelector(`[data-wid='${wid_2}'][data-pid='${para_idx}']`)
		const rect1 = el1.getBoundingClientRect()
		const rect2 = el2.getBoundingClientRect()
		const editor_rect = editor_el.getBoundingClientRect()
		const is_next_line = rect2.top !== rect1.top
		return {
			left: is_next_line ? rect1.left + (editor_rect.left + editor_rect.width - rect1.left) / 2 : rect1.left,
			top: rect1.top,
			width: total_width
		}
	}

	const createComment = (text) => {
		let is_highlight = !!computed_highlight_end_idx
		let start_wid = is_highlight ? computed_highlight_start_idx : cursor_idx
		let end_wid = is_highlight ? computed_highlight_end_idx : null
		comments.push(
			{
				pid: para_idx,
				start_wid,
				end_wid,
				text
			}
		)
		comments = comments
		clearHighlight()
	}

	const deletedSelection = () => {
		edit_start_idx = highlight_start_idx
		edit_end_idx = highlight_end_idx
		edit_log.push(
			{
				type: 'delete',
				pid: para_idx,
				start_wid: computed_highlight_start_idx,
				end_wid: computed_highlight_end_idx
			}
		)
		edit_log = edit_log
		setTimeout(() => {edit_log = edit_log}, 0)
		clearHighlight()
		getCrossover()
	}

	const createAdditionWords = (text) => {
		edit_log.push(
			{
				type: 'add',
				pid: para_idx,
				start_wid: cursor_idx,
				text
			}
		)
		edit_log = edit_log
		setTimeout(() => {edit_log = edit_log}, 10)
	}

	const addNextParaSymbol = () => {
		edit_log.push(
			{
				type: 'next-paragraph',
				pid: para_idx,
				start_wid: cursor_idx
			}
		)
		edit_log = edit_log
		setTimeout(() => {edit_log = edit_log}, 10)
		getCrossover()
	}

	const updateEditing = text => {
		let word_obj = edit_log.find(w => w.start_wid === edit_start_idx)
		if (!word_obj) return console.warn('updateEditing: word_obj is undefined')
		word_obj.text = text
		edit_log = edit_log
		setTimeout(() => {edit_log = edit_log}, 10)
	}

	const createEditWords = (text) => {
		edit_log.push(
			{
				type: 'correction',
				pid: para_idx,
				start_wid: computed_highlight_start_idx,
				end_wid: computed_highlight_end_idx,
				text
			}
		)
		edit_log = edit_log
		setTimeout(() => {edit_log = edit_log}, 10)
		clearHighlight()
	}

	const clearHighlight = () => {
		highlight_start_idx = null
		highlight_end_idx = null
	}

	const clearEditHighlight = () => {
		edit_start_idx = null
		edit_end_idx = null
		edit_type = null
	}

	const clearCommentHighlight = () => {
		comment_start_idx = null
		comment_end_idx = null
		active_comment_idx = null
	}

	const onUndo = async () => {
		edit_log.splice(edit_log.findIndex(w => (w.start_wid === edit_start_idx) && w.pid === para_idx), 1)
		await tick()
		edit_log = edit_log
		setTimeout(() => {edit_log = edit_log}, 10)
		clearEditHighlight()
	}

	const undoMultipleAmendments = async () => {
		highlighted_amendments.forEach(idx => {
			edit_log.splice(edit_log.findIndex(w => (w.start_wid === idx) && w.pid === para_idx), 1)
		})
		await tick()
		edit_log = edit_log
		setTimeout(() => {edit_log = edit_log}, 10)
		clearEditHighlight()
	}

	const onEditComment = (comment, idx) => {
		active_button = 'comment'
		openModal(EditComment, {
			comment_idx: comments.findIndex(c => c === comment) + 1,
			highlighted_text: getTextByPosition(comment.pid, comment.start_wid, comment.end_wid),
			comment_text: comment.text,
			onDelete: () => onDeleteComment(idx),
			onEdit: (text) => updateComment(comment, text)
		}, {
			styleWindow: {
				width: '500px',
				borderRadius: '0.5em'
			},
			styleContent: {
				padding: 0,
				borderRadius: '0.5em'
			},
			closeButton: true
		}, {
			onClose: () => {
				active_button = null
			}
		})
	}

	const onDeleteComment = (idx) => {
		comments.splice(idx,1)
		comments = comments
	}

	const updateComment = (comment, text) => {
		comment.text = text
		comments = comments
	}

	const updateAbsolutePositionElements = () => {
		edit_log = edit_log
	}

	const onWindowResize = () => {
		updateAbsolutePositionElements()
	}

	const addFontSize = () => {
		font_size +=2
	}

	const lessFontSize = () => {
		font_size -=2
	}

	const getTextByPosition = (pid, start_wid, end_wid) => {
		let p = para[pid]
		return p.slice(start_wid, end_wid).map(word => word.wording).join(' ')
	}

	const onToolbarClick = () => {
		wait_for_highlight_end = false
	}

	onMount(() => {
		is_mobile = (('ontouchstart' in window) ||
			(navigator.maxTouchPoints > 0) ||
			(navigator.msMaxTouchPoints > 0));
		if (is_readonly) return
		if (is_mobile) {
			editor_el.addEventListener('touchstart', onMouseDown)
			editor_el.addEventListener('touchend', onMouseUp)
		} else {
			editor_el.addEventListener('mousedown', onMouseDown)
			editor_el.addEventListener('mouseup', onMouseUp)
		}
		return () => {
			if (is_mobile) {
				editor_el.removeEventListener('touchstart', onMouseDown)
				editor_el.removeEventListener('touchend', onMouseUp)
			} else {
				editor_el.removeEventListener('mousedown', onMouseDown)
				editor_el.removeEventListener('mouseup', onMouseUp)
			}
		}
	})

	const onActivate = () => {
		text_editor_active = true
	}

	const onRedWordClick = (word) => {
		para_idx = word.pid
		cursor_idx = word.start_wid
		edit_start_idx = word.start_wid
		edit_end_idx = word.end_wid
		edit_type = 'correction'
	}
</script>

<svelte:window on:keydown={onkeydown} on:mousemove={onMouseMove} on:resize={onWindowResize}/>

<div class="text-xs p-4 leading-tight hidden" style="font-size: 12px">
	<p>cursor: {cursor_idx}</p>
	<p>para: {para_idx}</p>
	<p>mouse start: {mousedown_start_idx}</p>
	<p>highlight start: {highlight_start_idx}</p>
	<p>highlight end: {highlight_end_idx}</p>
<!--	<p>c highlight start: {computed_highlight_start_idx}</p>-->
<!--	<p>c highlight end: {computed_highlight_end_idx}</p>-->
	<p>edit start: {edit_start_idx}</p>
	<p>edit end: {edit_end_idx}</p>
	<p>edit type: {edit_type}</p>
	<p>active button: {active_button}</p>
	<p>highlighted_amendments: {highlighted_amendments}</p>
	<p>is_long_press: {is_long_press}</p>
	<p>wait_for_highlight_end: {wait_for_highlight_end}</p>
</div>


<div on:click={onActivate} id="writing-editor">
	<div class="bg-white rounded border border-gray-300" class:border-blue-500={text_editor_active} bind:this={para_el}>
		{#if !is_readonly}
			<div on:click={onToolbarClick} class="toolbar px-4 flex items-center py-1 text-gray-700 border-b border-gray-200 top-10 z-40 bg-white" style="font-size: 22px">
				<div class="flex-1 flex items-center">
					{#if highlighted_amendments.length}
						<button use:tooltip={'Undo'} class="tool-button" on:click={undoMultipleAmendments}>
							<svg class="fill-current w-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6.33223 3L2 7.33046V18.8801H13.5497L17.8819 14.5497H9.80859C11.7921 12.3333 14.6746 10.9392 17.8819 10.9392C23.8605 10.9392 28.7098 15.7867 28.7098 21.768C28.7098 24.7591 27.4975 27.4678 25.5378 29.4266L29.1113 33C31.985 30.1245 33.7638 26.154 33.7638 21.7671C33.7638 12.9968 26.6522 5.88521 17.8819 5.88521C13.3291 5.88521 9.22626 7.79986 6.32958 10.8668L6.33223 3Z"/>
							</svg>
						</button>
					{:else if edit_type}
						<button use:tooltip={'Undo'} class="tool-button" on:click={onUndo}>
							<svg class="fill-current w-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6.33223 3L2 7.33046V18.8801H13.5497L17.8819 14.5497H9.80859C11.7921 12.3333 14.6746 10.9392 17.8819 10.9392C23.8605 10.9392 28.7098 15.7867 28.7098 21.768C28.7098 24.7591 27.4975 27.4678 25.5378 29.4266L29.1113 33C31.985 30.1245 33.7638 26.154 33.7638 21.7671C33.7638 12.9968 26.6522 5.88521 17.8819 5.88521C13.3291 5.88521 9.22626 7.79986 6.32958 10.8668L6.33223 3Z"/>
							</svg>
						</button>
						{#if ['add','correction'].includes(edit_type)}
							<button use:tooltip={'Edit'} class="tool-button" on:click={() => {showPopup('edit')}}>
								<svg class="fill-current w-6" viewBox="0 0 36 36"><path d="M33.188 1.356l1.455 1.456c1.81 1.81 1.81 4.74 0 6.55l-2.547 2.546-8.006-8.004 2.55-2.547c1.805-1.81 4.74-1.81 6.548 0zM10.99 33.016l-8.006-8.008L22.634 5.36l8.006 8.005-19.65 19.65zM2.258 27.92l5.822 5.822L0 36l2.258-8.08z"></path></svg>
							</button>
						{/if}
					{:else}
						<button use:tooltip={'Correct'} class="tool-button" on:click={() => {showPopup('correction')}} class:active={active_button === 'correction'} disabled={highlight_start_idx === null}>
							<svg class="fill-current w-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M27.9529 34.6139C27.7829 34.4479 27.6159 34.2559 27.4709 34.0639L13.1599 19.75C9.68194 20.854 5.72694 20.013 2.97194 17.257C0.644939 14.932 -0.316061 11.743 0.0919388 8.71995L5.82394 14.452L12.6319 12.605L14.4769 5.79695L8.74694 0.0919518C11.7929 -0.316048 14.9589 0.641952 17.2819 2.94595C20.0399 5.72595 20.8779 9.68095 19.7779 13.158L34.0899 27.472C34.2799 27.615 34.4479 27.759 34.6159 27.928C36.4609 29.773 36.4609 32.77 34.6159 34.615C32.7959 36.462 29.7989 36.462 27.9529 34.615V34.6139ZM32.1229 29.246C31.3329 28.454 30.0369 28.454 29.2459 29.246C28.4559 30.036 28.4559 31.309 29.2459 32.0979C30.0359 32.888 31.3319 32.888 32.1229 32.0979C32.9129 31.3079 32.9129 30.038 32.1229 29.246V29.246Z"/>
							</svg>
						</button>
						<button use:tooltip={'Delete'} class="tool-button" on:click={deletedSelection} disabled={highlight_start_idx === null}>
							<svg class="fill-current w-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M32.5049 22.9901C30.2349 20.7201 27.4669 19.4941 25.1249 19.4941C24.7489 19.4941 24.3849 19.5291 24.0349 19.5941L21.7069 17.2641L28.8719 10.1001C28.8719 10.1001 34.3559 4.41213 30.7519 0.807129L17.9999 13.5571L5.24991 0.807129C1.64391 4.41313 7.12791 10.1001 7.12791 10.1001L14.2919 17.2641L11.9649 19.5941C11.6149 19.5301 11.2509 19.4941 10.8749 19.4941C8.53491 19.4941 5.76491 20.7211 3.49491 22.9901C-0.112087 26.5951 -1.08509 31.4701 1.31791 33.8731C2.21191 34.7661 3.44191 35.1931 4.82391 35.1931C7.16391 35.1931 9.93391 33.9631 12.2039 31.6971C14.7939 29.1071 16.0159 25.8691 15.6139 23.3571L17.9999 20.9701L20.3839 23.3581C19.9839 25.8701 21.2059 29.1081 23.7939 31.6981C26.0659 33.9661 28.8339 35.1941 31.1739 35.1941C32.5569 35.1941 33.7869 34.7661 34.6809 33.8741C37.0859 31.4711 36.1109 26.5961 32.5059 22.9901H32.5049ZM9.76491 29.2601C7.93091 31.0941 5.95691 31.7461 4.82491 31.7461C4.54191 31.7461 4.02691 31.7061 3.75791 31.4361C3.08191 30.7611 3.39491 27.9661 5.93391 25.4261C7.76991 23.5911 9.74391 22.9411 10.8739 22.9411C11.1589 22.9411 11.6739 22.9811 11.9439 23.2531C12.6199 23.9271 12.3039 26.7231 9.76591 29.2611L9.76491 29.2601ZM32.2449 31.4361C31.9729 31.7061 31.4589 31.7461 31.1749 31.7461C30.0449 31.7461 28.0699 31.0961 26.2349 29.2611C23.6949 26.7231 23.3809 23.9281 24.0569 23.2541C24.3269 22.9841 24.8419 22.9441 25.1249 22.9441C26.2579 22.9441 28.2309 23.5941 30.0669 25.4291C32.6049 27.9691 32.9189 30.7631 32.2439 31.4371L32.2449 31.4361Z"/>
							</svg>
						</button>
						<button use:tooltip={'Insert'} class="tool-button" on:click={() => {showPopup('add')}} class:active={active_button === 'add'} disabled={highlight_start_idx !== null}>
							<svg class="fill-current w-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M30 36L18 12L6 36H30ZM10.2058 33.5L14.1029 25.25H21.8972L25.7943 33.5H10.2058Z"/>
								<circle cx="9" cy="7" r="3"/>
								<circle cx="18" cy="7" r="3"/>
								<circle cx="27" cy="7" r="3"/>
							</svg>
						</button>
						<button use:tooltip={'Paragraphing'} class="tool-button" on:click={addNextParaSymbol} disabled={!!highlight_start_idx}>
							<svg class="fill-current w-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 2.51911C8.49778 3.74044 6 7.08178 6 11.0009C6 15.6391 9.49956 19.4613 14 19.9609V34H18V6H22V34H26V6H30V2H12V2.51911Z"/>
							</svg>
						</button>
					{/if}
					<div class="mx-1 border-l h-6 border-gray-300"></div>
					<button use:tooltip={'Zoom out'} class="tool-button" on:click={lessFontSize} disabled={min_font_size === font_size}>
						<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="w-6"><path d="M17 12h11v3H17z"></path><path d="M22.424 0C14.926 0 8.848 6.078 8.848 13.576c0 2.568.713 4.97 1.95 7.017L.956 30.438c-1.273 1.273-1.273 3.334 0 4.607 1.27 1.273 3.334 1.273 4.607 0l9.802-9.803c2.09 1.197 4.49 1.91 7.06 1.91C29.922 27.152 36 21.074 36 13.576S29.922 0 22.424 0zm0 22.808c-5.1 0-9.232-4.133-9.232-9.232s4.134-9.232 9.232-9.232 9.232 4.133 9.232 9.232-4.134 9.232-9.232 9.232z"></path></svg>
					</button>
					<button use:tooltip={'Zoom in'} class="tool-button" on:click={addFontSize} disabled={max_font_size === font_size}>
						<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="w-6"><path d="M22.425 0C14.927 0 8.85 6.078 8.85 13.576c0 2.568.712 4.97 1.95 7.017L.954 30.438c-1.27 1.273-1.27 3.334 0 4.607 1.273 1.273 3.336 1.273 4.61 0l9.8-9.803c2.09 1.197 4.49 1.91 7.06 1.91C29.923 27.152 36 21.074 36 13.576S29.922 0 22.425 0zm0 22.808c-5.1 0-9.232-4.133-9.232-9.232s4.133-9.232 9.232-9.232c5.098 0 9.23 4.133 9.23 9.232s-4.133 9.232-9.23 9.232z"></path><path d="M24 8h-3v4h-4v3h4v4h3v-4h4v-3h-4"></path></svg>
					</button>
					<div class="mx-1 border-l h-6 border-gray-300"></div>
					<button class="tool-button" use:tooltip={'Add comment'}
					        disabled={comment_button_disabled}
					        class:active={active_button === 'comment'}
					        on:click={() => {showPopup('comment')}}>
						<CommentSvg/>
					</button>
				</div>
			</div>
		{/if}

		<div style="font-size: {`${font_size/20}em`}" class="p-4 cursor-text" bind:this={editor_el}>
			{#if computed_para && computed_para.length}
				{#each computed_para as p, i}
					<div class="flex flex-wrap" class:mb-8={i < computed_para.length - 1}>
						{#each p as w}
							{#if w.red_word}
								{#each w.words as word}
									<div on:click={() => {onRedWordClick(word)}} data-red-word style="line-height: 2"
									     class="text-red-500 px-0.5 border-b border-red-500 relative">
										{word.word}
										{#if (para_idx === word.pid && word.start_wid === edit_start_idx && word.end_wid === edit_end_idx)}
											<div class="absolute z-10 inset-0 bg-yellow-700 opacity-20"></div>
										{/if}
									</div>
								{/each}
							{:else}
								<div data-pid={w.pid} data-sid={w.sid} data-wid={w.wid}
								     class="relative select-none word">

									{#if para_idx === w.pid}
										{#if ['correction','delete'].includes(w.amendment_type) && (w.wid >= edit_start_idx && w.wid < edit_end_idx || highlighted_amendments.includes(w.wid))}
											<div class="absolute z-10 inset-0 bg-yellow-700 opacity-20"></div>
										{/if}
										{#if w.wid >= computed_highlight_start_idx && w.wid < computed_highlight_end_idx}
											<div class="absolute z-20 inset-0 bg-red-500 opacity-20"></div>
										{/if}
									{/if}
									<div style="line-height: 2" class="relative z-10 {isSymbol(w) ? 'pr-1 -ml-1' : 'px-1'}">
										{w.wording}
									</div>
									{#if w.amendment_type === 'delete' || w.amendment_type === 'correction'}
										<div style="height: 3px" class="bg-red-500 absolute inset-x-0 top-1/2"></div>
									{/if}
									{#if w.comment}
										<div class="absolute inset-x-0 bottom-1 comment-dot"></div>
									{/if}
									{#if cursor_idx === w.wid && para_idx === w.pid && !is_readonly}
										<div bind:this={cursor_el}
										     class="{cursor_visible ? 'cursor' : 'opacity-0'} bg-red-500 w-0.5 ml-0.5 absolute inset-y-0 left-0 z-10"></div>
									{/if}
								</div>
							{/if}
						{/each}
					</div>
				{/each}
			{/if}
			{#each edit_log as w}
				{#if w.type === 'next-paragraph'}
					<div
						class="{w.pid === para_idx && w.start_wid === edit_start_idx ? 'bg-yellow-700 bg-opacity-20' : ''} select-none absolute text-red-500 px-1 py-1 transform -translate-x-1/2" use:getPosition={w}>
						<svg class="fill-current w-6" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2.51911C8.49778 3.74044 6 7.08178 6 11.0009C6 15.6391 9.49956 19.4613 14 19.9609V34H18V6H22V34H26V6H30V2H12V2.51911Z"/>
						</svg>
					</div>
				{/if}
			{/each}
			{#each comments as c, i}
				<div
					use:getPosition={c}
					class="{!c.end_wid ? '-translate-x-1/2 transform' : ''} bg-red-500 select-none mt-2.5 w-5 h-5 flex items-center justify-center text-white text-xs font-bold rounded-full absolute">
					{i+1}
				</div>
			{/each}
		</div>
		{#if comments.length || is_any_next_para_symbol}
			<div class="p-4 border-t border-gray-200">
				{#if is_any_next_para_symbol}
					<div class="mb-4">
						<svg class="fill-current w-6 text-red-500" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2.51911C8.49778 3.74044 6 7.08178 6 11.0009C6 15.6391 9.49956 19.4613 14 19.9609V34H18V6H22V34H26V6H30V2H12V2.51911Z"/>
						</svg>
						<div class="text-gray-500 flex">
							<span class="text-xs text-gray-500 py-1">Comment:</span>
							<span class="underline ml-1">New paragraph</span>
						</div>
					</div>
				{/if}
				{#each comments as c,i}
					<div class="group flex items-center" class:mb-4={i < comments.length - 1}>
						<div class="flex-1">
							<div class="flex items-start">
								<div style="font-size: 0.6em" class="bg-red-500 flex-shrink-0 w-5 h-5 flex items-center justify-center text-white font-bold rounded-full">{i + 1}</div>
								<div class="inline-block ml-1">
									<p class="italic text-gray-400" style="font-size: 0.78em">{getTextByPosition(c.pid, c.start_wid, c.end_wid)}</p>
								</div>
							</div>
							<div class="text-gray-500 flex items-start">
								<span class="text-xs text-gray-500 py-1">Comment:</span>
								<span class="underline ml-1">{c.text}</span>
								{#if !is_readonly}
									<div class="flex-shrink-0 ml-auto">
										<button on:click={() => {onEditComment(c,i)}} class="ml-4 bg-gray-100 hover:bg-gray-200 rounded text-blue-500 px-2 py-1 flex justify-center items-center text-sm">
											Edit
										</button>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes cursor {
		0% {
			opacity: 100%;
		}
		50% {
			opacity: 100%;
		}
		51% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}
	.cursor {
		animation: cursor 1s;
		animation-iteration-count: infinite;
	}
	.tool-button {
		width: 2.25em;
		height: 2.25em;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
		outline: none !important;
	}
	.tool-button:hover {
		border: 1px solid #CCC;
		background: #FAFAFA;
		color: black;
	}
	.tool-button.active {
		border: 1px solid #3E749F;
		color: #3E749F
	}
	.tool-button[disabled] {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.comment-dot {
		background-image: url('/comment-underline.png');
		height: 5px;
		background-size: auto 5px;
	}
</style>
