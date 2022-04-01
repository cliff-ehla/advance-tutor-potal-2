<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const identifier = page.params.identifier
		const {data, success, debug, status} = await http.get(fetch, `/writingApi/get_user_writing?identifier=${identifier}`)
		if (!success) return onFail(debug, status)
		const {para, edit_log, comments, title, writing_id} = data
		return {
			props: {
				para, edit_log, comments, title, writing_id
			}
		}
	}
</script>

<script>
	import {dialog} from "$lib/store/dialog.js";

	export let para
	export let edit_log
	export let comments
	export let title
	export let writing_id
	import Writing from '$lib/writing/index.svelte'
	import WritingMarking from '$lib/writing/_writing_marking.svelte'
	import WritingComment from '$lib/writing/_writing_comment.svelte'
	import TemplateTextBox from '$lib/writing/_template-text-box.svelte'
	import Button from '$lib/ui/button.svelte'
	import {onMount} from "svelte";
	import {notifications} from "$lib/store/notification.js";

	let marking_category
	let user_handwriting_images
	let overall_msg
	let active_image_url
	let overall_options

	let is_edit
	let disclose
	let is_read

	onMount(async () => {
		const {data, success} = await http.post(fetch, '/writingApi/get_student_writing_submission', {
			user_writing_id: writing_id
		})
		console.log(data)
		overall_msg = data.overall_msg
		let _marking_category = data.marking_category
		user_handwriting_images = data.user_handwriting_images

		let res = await http.get(fetch, '/writingApi/writings_comment_map')
		let data2 = res.data
		overall_options = data.overall
		disclose = data.disclose
		is_read = data.is_read
		_marking_category.forEach(cat => {
			cat.comment_template = data2[cat.title]
		})
		marking_category = _marking_category
	})

	const onSubmitClick = async (is_draft) => {
		dialog.confirm({
			title: disclose === '1' ? 'Reminder' : '',
			message: is_draft ? 'Save draft' : disclose === '1' ? 'Your grading was sent to the student, do you want to revise your grading?' : 'Send marking to the student',
			onConfirm: async () => {
				const obj = {}
				const comments = []
				marking_category.forEach(cat => {
					obj[cat.title] = cat.user_mark
					cat.comments.forEach(c => comments.push(c))
				})
				await http.post(fetch, '/writingApi/modify_mark', {
					user_writing_id: writing_id,
					disclose: is_draft ? 0 : 1,
					content_mark: obj.content,
					language_mark: obj.language,
					organizations_mark: obj.organizations,
					vocabulary_mark: obj.vocabulary,
					sentence_mark: obj.sentence,
					overall_msg
				})
				await http.post(fetch, '/writingApi/submit_comment', {
					user_writing_id: writing_id,
					comments
				})
				notifications.success(is_draft ? 'Draft saved' : disclose === '1' ? 'Marking updated' : 'Your marking have sent to student')
				history.back()
			}
		})
	}

	const onSaveEditing = (e) => {
		let {edit_log, para, comments} = e.detail
		saveEditingJson(writing_id, edit_log, para, comments)
	}

	async function saveEditingJson (writing_id, edit_log, para, comments, _fetch) {
		await http.post(fetch, '/writingApi/set_extra_json', {
			user_writing_id: writing_id,
			extra_json: {
				edit_log, para, comments
			}
		})
	}
</script>

<div class="bg-gray-50">
	<div class="p-4 max-w-screen-lg mx-auto">
		<h1 class="font-light text-gray-700 mb-4" style="font-size: 1.8em">{title || 'No title'}</h1>
		<Writing on:update={onSaveEditing} {para} {edit_log} {comments} {title} {writing_id}/>

		{#if user_handwriting_images && user_handwriting_images.length}
			<div class="my-8 flex">
				<div>
					{#each user_handwriting_images as img_obj}
						<img on:click={() => {active_image_url = img_obj.image_url}} class="cursor-pointer w-40 rounded mr-4" src={img_obj.image_url} alt="handwriting">
					{/each}
				</div>
			</div>
		{/if}
		{#if marking_category}
			<div class="my-4 bg-white border border-gray-200 rounded-lg">
				<div class="max-w-screen-lg mx-auto">
					<div class="px-4 py-2 bg-blue-50 text-blue-500 border-b border-gray-200 rounded-t-lg">
						Rating
					</div>
					<div class="px-8 py-4">
						<WritingMarking on:input={e => {marking_category = e.detail}} {marking_category}/>
					</div>
				</div>
			</div>

			<div class="my-4 bg-white border border-gray-200 rounded-lg">
				<div class="max-w-screen-lg mx-auto">
					<div class="px-4 py-2 bg-blue-50 text-blue-500 border-b border-gray-200 rounded-t-lg">
						Comments
					</div>
					<div class="px-8 py-4">
						<WritingComment on:input={e => {marking_category = e.detail}} {marking_category}/>
						<div class="flex items-start py-2">
							<p class="text-gray-700 w-28 pt-4 text-right">Overall</p>
							<div class="flex-1 px-4">
								<TemplateTextBox value={overall_msg} on:input={e => {overall_msg = e.detail}} options={overall_options}/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="py-4 flex items-center justify-center">
				{#if disclose === '1'}
					{#if is_read === '1'}
						<button on:click={() => {history.back()}} class="text-gray-500 hover:text-blue-500 hover:border-blue-500 rounded bg-white border border-gray-200 px-4 py-2 w-40 text-center">
							Back
						</button>
					{:else}
						<button on:click={() => {history.back()}} class="text-gray-500 hover:text-blue-500 hover:border-blue-500 rounded bg-white border border-gray-200 px-4 py-2 w-40 text-center">
							Back
						</button>
						<div class="ml-8">
							<Button button_class="px-8 w-40 py-2" on:click={() => {onSubmitClick(false)}}>
								Edit
							</Button>
						</div>
					{/if}
				{:else}
					<div class="flex items-center justify-center">
						<button on:click={() => {history.back()}} class="text-gray-500 hover:text-blue-500 hover:border-blue-500 rounded bg-white border border-gray-200 px-4 py-2 w-40 text-center">
							Back
						</button>
						<div class="ml-2">
							<Button on:click={() => {onSubmitClick(true)}}>
								Save draft
							</Button>
						</div>
					</div>
					<div class="ml-16">
						<Button on:click={() => {onSubmitClick(false)}}>
							Complete marking and send to student
						</Button>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if active_image_url}
		<div on:click={() => {active_image_url = null}} class="fixed z-40 inset-0 bg-black opacity-60"></div>
		<div class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded" style="width: 600px">
			<img src={active_image_url} alt="image">
		</div>
	{/if}
</div>