<script>
	import {http} from "$lib/http.js";

	export let identifier
	import {onMount} from "svelte";
	import Writing from '$lib/writing/index.svelte'
	import {capitalize} from "$lib/helper/capitalize.js";

	let para, edit_log, comments, title, writing_id
	let overall_msg
	let marking_category
	let overall_mark

	$: {
		if (identifier) {
			getWriting()
		}
	}

	const getWriting = async () => {
		const {data, success, debug} = await http.get(fetch, `/writingApi/get_user_writing?identifier=${identifier}`)
		para = data.para
		edit_log = data.edit_log
		comments = data.comments
		title = data.title
		writing_id = data.writing_id
		await getMarking(writing_id)
	}

	const getMarking = async (writing_id) => {
		const {data, success} = await http.post(fetch, '/writingApi/get_student_writing_submission', {
			user_writing_id: writing_id
		})
		if (success) {
			overall_msg = data.overall_msg
			marking_category = data.marking_category
			overall_mark = marking_category.reduce((a,b) => a + Number(b.user_mark), 0)
		}
	}
</script>

{#if title && para}
	<h1 class="page-title mb-4">{title}</h1>
	<Writing {para} {edit_log} {comments} {title} {writing_id}/>
{/if}

{#if marking_category}
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pb-12">
		<div>
			<div class="border border-gray-300 rounded-lg">
				<div class="px-4 py-2 bg-blue-50 text-blue-500 rounded-t-lg">
					Rating
				</div>
				{#if !overall_mark}
					<p class="text-gray-400 p-4">No rating</p>
				{:else}
					<div class="p-4 flex">
						<div class="w-12 h-12 rounded-full cc bg-gray-100 text-xl flex-shrink-0">
							{overall_mark}
						</div>
						<div class="grid grid-cols-2 gap-x-8 ml-8">
							{#each marking_category as cat}
								<div class="text-sm flex items-center">
									<p class="w-24 mr-1 text-gray-500" >{capitalize(cat.title)}</p>
									<p>{cat.user_mark}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div>
			<div class="border border-gray-300 rounded-lg">
				<div class="px-4 py-2 bg-blue-50 text-blue-500 rounded-t-lg">
					Comments
				</div>
				<div class="p-4">
					{#if overall_msg}
						{overall_msg}
					{:else}
						<p class="text-gray-400">No comments</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}