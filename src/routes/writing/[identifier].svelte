<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const identifier = page.params.identifier
		const {data, success, debug} = await http.get(fetch, `/writingApi/get_user_writing?identifier=${identifier}`)
		const {para, edit_log, comments, title, writing_id} = data
		return {
			props: {
				para, edit_log, comments, title, writing_id
			}
		}
	}
</script>

<script>
	export let para
	export let edit_log
	export let comments
	export let title
	export let writing_id
	import Writing from '$lib/writing/index.svelte'
	import {onMount} from "svelte";

	let marking_category
	let user_handwriting_images
	let overall_msg
	let active_image_url

	onMount(async () => {
		const {data, success} = await http.post(fetch, '/writingApi/get_student_writing_submission', {
			user_writing_id: writing_id
		})
		overall_msg = data.overall_msg
		marking_category = data.marking_category
		user_handwriting_images = data.user_handwriting_images
	})
</script>

<div class="p-4">
	<h1 class="page-title mb-4">{title}</h1>
	<Writing {para} {edit_log} {comments} {title} {writing_id}/>
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

{#if active_image_url}
	<div on:click={() => {active_image_url = null}} class="fixed z-40 inset-0 bg-black opacity-60"></div>
	<div class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded" style="width: 600px">
		<img src={active_image_url} alt="image">
	</div>
{/if}