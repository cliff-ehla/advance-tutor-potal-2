<script context="module">
	import {getDictationResultList} from "../../../../../../../../api/selfie-api";
	import {getStudentLessonList} from "../../../../../../../../api/tutor-api";

	export async function load ({page, fetch}) {
		let { task_id, tutor_group_id, day_id, article_id} = page.params
		let child_id = page.query.get("user_id")
		const data = await getDictationResultList({
			lesson_id: task_id, tutor_group_id, day_id, child_id, article_id
		}, fetch)

		const user_id = page.query.get("user_id")
		const lessons = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
		return {
			props: {
				results: data,
				lessons
			}
		}
	}
</script>

<script>
	import {stores} from "$app/stores";
	import {tutor_group_store} from "../../../../../../../../store";
	const {page} = stores()

	import Breadcrumb from '../../../../_breadcrumb.svelte'
	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../../../store";

	export let results
	export let lessons

	const result = results && results[0]

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}
	$: tasks = lesson ? lesson.lesson : null
	$: task = tasks ? tasks.find(t => t.lesson_id == $page.params.task_id) : null

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<Breadcrumb {tutor_group} {lesson}>Result</Breadcrumb>

{#if result}
	<div class="bg-green-500 text-white text-center py-6 leading-none">
		<p class="mb-2 inline-flex items-end">
			<span class="text-h1 font-bold">{result.mark}</span>
			<span class="mb-1 ml-2">%</span>
		</p>
		<p>Correct rate</p>
	</div>

	<div class="p-8">
		<div class="p-8 bg-white border border-gray-300 rounded mb-4">
			<div class="mb-4">
				<p class="text-t1 font-bold">Student's text:</p>
				<p class="text-xs">Submitted on: {result.create_ts}</p>
			</div>
			<p>{result.user_input_article}</p>
			<div class="mt-4 pt-4 border-t border-gray-300">
				{#each result.image_urls as img}
					<img src="{img}" alt="handwriting" class="w-40 rounded">
				{/each}
			</div>
		</div>
		<div class="p-8 bg-white border border-gray-300 rounded">
			<div class="mb-4">
				<p class="text-t1 font-bold">Target text:</p>
			</div>
			<p>{@html result.o_text_html}</p>
		</div>
	</div>
{/if}