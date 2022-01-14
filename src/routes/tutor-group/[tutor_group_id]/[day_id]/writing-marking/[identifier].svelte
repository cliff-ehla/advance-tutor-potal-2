<script context="module">
	import {getUserWriting, saveEditingJson, gradeWriting, getWritingMarks, getCommentsTemplate} from "../../../../../api/writing-api";
	import {getTutorGroupLessonList} from "../../../../../api/tutor-api";
	import Breadcrumb from '../_breadcrumb.svelte'
	import Dropdown from '../../../../../components/ui-elements/dropdown3.svelte'
	import Icon from '../../../../../components/ui-elements/icon.svelte'
	import TemplateTextBox from './_template-text-box.svelte'

	export async function load ({page, fetch}) {
		let {para, edit_log, comments, title, writing_id} = await getUserWriting(page.params.identifier, fetch)
		return {
			props: {
				para,
				edit_log,
				comments,
				title,
				writing_id
			}
		}
	}
</script>

<script>
	import {submitComments} from "../../../../../api/writing-api";
	import WritingEditor from "../../../../../components/writing/index.svelte";
	import {goto} from '$app/navigation'

	export let para
	export let edit_log
	export let comments
	export let title
	export let writing_id

	let user_handwriting_images
	let marking_category
	let overall_msg
	let active_image_url
	let overall_options

	import {tutor_group_store} from "../../../../../store";
	import {stores} from '$app/stores'
	import WritingMarking from './_writing_marking.svelte'
	import WritingComment from './_writing_comment.svelte'
	import RejectDialog from './_reject-dialog.svelte'
	import {onMount, getContext} from 'svelte'
	import {left_bar_visible} from "../../../../../store";
	import {notifications} from "$lib/store/notification.js";
	const {open} = getContext('simple-modal')
	const {page} = stores()
	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO($page.query.user_id) : null
	$: students  = lesson ? lesson.students : null
	$: student = students ? students.find(s => s.identifier === $page.params.identifier) : o_o_o
	$: is_edit = student ? student.status === 2 : false

	onMount(() => {
		fetchMarkingData()
		getTutorGroupLessonList($page.params.tutor_group_id, window.fetch, {use_cache: true})
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})

	const fetchMarkingData = async () => {
		const result = await getWritingMarks(writing_id, window.fetch)
		marking_category = result.marking_category
		user_handwriting_images = result.user_handwriting_images
		overall_msg = result.overall_msg
		let data = await getCommentsTemplate(window.fetch)
		overall_options = data.overall
		marking_category.forEach(cat => {
			cat.comment_template = data[cat.title]
		})
	}

	let loading = false
	let text_editor_active = true

	const onSubmitClick = async () => {
		const obj = {}
		const comments = []
		marking_category.forEach(cat => {
			obj[cat.title] = cat.user_mark
			cat.comments.forEach(c => comments.push(c))
		})
		loading = true
		await gradeWriting(writing_id, {
			'content_mark': obj.content,
			'organizations_mark': obj.organizations,
			'sentence_mark': obj.sentence,
			'vocabulary_mark': obj.vocabulary,
			'language_mark': obj.language
		}, overall_msg, window.fetch)
		await submitComments(writing_id, comments)
		loading = false
		notifications.success('Your marking is updated')
		history.back()
	}

	const onSaveEditing = (e) => {
		let {edit_log, para, comments} = e.detail
		saveEditingJson(writing_id, edit_log, para, comments)
	}

	const onReject = () => {
		open(RejectDialog, {
			user_writing_id: writing_id,
			onRejectSuccess: () => {
				let c_id = $page.query.c_id
				let url = `/tutor-group/${$page.params.tutor_group_id}/${$page.params.day_id}`
				if (c_id) {
					url += `?c_id=${c_id}`
				}
				goto(url)
			}
		}, {
			styleWindow: {
				width: '600px',
				borderRadius: '1em'
			},
			styleContent: {
				overflow: 'initial'
			}
		})
	}

	const onWindowClick = e => {
		let el = e.target.closest('#writing-editor')
		let click_outside = !el
		if (click_outside) {
			text_editor_active = true
			setTimeout(() => {
				text_editor_active = false
			}, 10)
		}
	}
</script>

<svelte:window on:click={onWindowClick}/>

<Breadcrumb {tutor_group} {lesson}>
	{#if student}
		<div class="inline-flex items-center p-2">
			<img src="{student.avatar_filepath}" class="w-6 h-6 rounded-full"/>
			<p class="leading-none ml-1">{student.username}</p>
		</div>
	{/if}
</Breadcrumb>

{#if student}
	<div class="max-w-screen-lg p-12 pb-0 text-p2 leading-relaxed bg-white mx-auto bg-gray-100">
		<div class="mb-8">
			<div class="flex mb-4">
				<h1 class="text-h1">
					{#if is_edit}<span class="font-bold text-red-500">Edit: </span>{/if}
					<span>{title}</span>
				</h1>
				<div class="ml-auto">
					<Dropdown placement="bottom-end" activator_style="w-12 h-12 flex items-center justify-center rounded-full" activator_active_style="bg-gray-100 bg-white">
						<button slot="activator">
							<Icon className="w-6" name="more"/>
						</button>
						<div class="bg-white border border-gray-300 rounded shadow-lg w-64">
							<div on:click={onReject} class="px-4 py-2 cursor-pointer hover:text-red-500 hover:bg-gray-100">Reject</div>
						</div>
					</Dropdown>
				</div>
			</div>
			<div class="inline-flex items-center">
				<img src="{student.avatar_filepath}" class="w-12 h-12 rounded-full"/>
				<div class="ml-2">
					<p class="text-sm text-gray-400">Student</p>
					<p class="font-bold leading-none">{student.username}</p>
				</div>
			</div>
		</div>
		<div class="mb-8">
			<WritingEditor {text_editor_active} {para} {edit_log} {comments} on:update={onSaveEditing}/>
		</div>
		{#if user_handwriting_images && user_handwriting_images.length}
			<div class="mb-8 flex">
				<div>
					{#each user_handwriting_images as img_obj}
						<img on:click={() => {active_image_url = img_obj.image_url}} class="cursor-pointer w-40 rounded mr-4" src={img_obj.image_url} alt="handwriting">
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}

{#if marking_category}
	<div class="bg-gray-100 border-t border-gray-300">
		<div class="max-w-screen-lg px-12 py-8 mx-auto">
			<h2 class="text-gray-500 text-t1 mb-2 font-bold border-b-2 inline-block border-current pb-1">Rating</h2>
			<WritingMarking on:input={e => {marking_category = e.detail}} {marking_category}/>
		</div>
	</div>

	<div class="bg-gray-100 border-b border-gray-300">
		<div class="bg-gray-100 border-t border-gray-300 max-w-screen-lg px-12 py-8 mx-auto">
			<h2 class="text-gray-500 text-t1 mb-2 font-bold border-b-2 inline-block border-current pb-1">Comments</h2>
			<WritingComment on:input={e => {marking_category = e.detail}} {marking_category}/>
			<div class="flex items-center py-4">
				<p class="font-bold w-32">Overall</p>
				<div class="flex-1 px-4">
					<TemplateTextBox value={overall_msg} on:input={e => {overall_msg = e.detail}} options={overall_options}/>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-white z-10 flex items-center justify-center border-t py-4">
		<button on:click={onSubmitClick} disabled="{loading}" class="{(loading) ? 'bg-gray-300 text-white' : 'bg-blue-500 text-white'} rounded px-16 py-2">
			{loading ? 'Submitting...' : is_edit ? 'Edit' : 'Complete marking'}
		</button>
	</div>
{/if}

{#if active_image_url}
	<div on:click={() => {active_image_url = null}} class="fixed z-40 inset-0 bg-black opacity-60"></div>
	<div class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded" style="width: 600px">
		<img src={active_image_url} alt="image">
	</div>
{/if}