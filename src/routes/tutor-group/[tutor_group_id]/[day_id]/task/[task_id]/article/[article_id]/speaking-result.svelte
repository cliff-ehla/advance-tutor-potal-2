<script context="module">
	import {getSelfieArticle} from "../../../../../../../../api/selfie-api";
	import {getStudentLessonList} from "../../../../../../../../api/tutor-api";

	export async function load ({page, fetch}) {
		let { task_id, tutor_group_id, day_id, article_id} = page.params
		let child_id = page.query.get("user_id")
		const data1 = await getSelfieArticle({
			lesson_id: task_id, tutor_group_id, day_id, child_id, article_id
		}, fetch)

		const user_id = page.query.get("user_id")
		const lessons = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
		return {
			props: {
				result: data1,
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
	import {slugToText} from "../../../../../../../../utils/slug-to-text";

	export let result
	export let lessons

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}
	$: tasks = lesson ? lesson.lesson : null
	$: task = tasks ? tasks.find(t => t.lesson_id == $page.params.task_id) : null

	$: sentences = result && result.sentences

	const word_map = {
		missing: 'text-red-500 font-bold',
		bad: 'text-red-500 font-bold',
		average: 'text-gray-500',
		good: 'text-green-500 font-bold'
	}

	$: formatted_result = sentences ? sentences.map(s => {
		const result_json = s.speak_result_json
		let score
		let words
		if (result_json) {
			score = {
				accuracy: Math.round(result_json.accuracy_score),
				fluency: Math.round(result_json.fluency_score),
				completion: Math.round(result_json.integrity_score)
			}
			score.overall = Math.round((score.accuracy + score.fluency + score.completion) / 3)
			words = result_json.sentences[0].words.filter(w => w.content !== 'sil')
			words = words.map(w => {
				const is_missing = w.dp_message === 16
				const score = w.total_score
				return {
					content: w.content,
					rating: is_missing ? 'missing' : score > 3.5 ? 'good' : score < 1.8 ? 'bad' : 'average'
				}
			})
		}
		return {
			score,
			words
		}
	}) : null

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<Breadcrumb {tutor_group} {lesson}>Result</Breadcrumb>

<div class="p-8">
	{#if formatted_result}
		{#each formatted_result as s}
			{#if s.words}
				<div class="p-8 bg-white border border-gray-300 rounded mb-4 flex items-center">
					<div class="flex flex-1">
						{#each s.words as w, i}
							<div class="mx-1 text-t1 {word_map[w.rating]}">
								{#if i === 0}
									{slugToText(w.content)}
								{:else}
									{w.content}
								{/if}
							</div>
						{/each}
					</div>

					<div class="ml-4">
						<p class="font-bold text-h1 mb-2">Score: {s.score.overall}</p>
						{#each ['accuracy', 'fluency', 'completion'] as key}
							<div class="flex items-center">
								<div class="w-20 text-xs">{slugToText(key)}</div>
								<div class="h-2 bg-gray-300 rounded w-28 relative">
									<div class="text-xxs font-bold absolute inset-0 bg-blue-500 px-2 text-white" style="width: {s.score[key] / 5 * 100}%">
										{s.score[key]}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>