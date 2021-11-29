<script context="module">
	import {getStudentLessonList} from "../../../../../../api/tutor-api";
	import {getVocabs} from "../../../../../../api/vocab-api";

	export async function load({page, session, fetch}) {
		const user_id = page.query.get("user_id")
		if (!session) {
			return {
				status: 302,
				redirect: '/login'
			}
		} else {
			let lessons = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
			let lesson = lessons.find(l => l.day_id == page.params.day_id)
			let tasks = lesson ? lesson.lesson : null
			let task = tasks ? tasks.find(t => t.lesson_id == page.params.task_id) : null
			let vocab_result = task ? task.vocab_result : null
			let vocab_ids = vocab_result.map(v => v.word_id)
			let combined_vocab_result = []
			if (vocab_ids) {
				const vocabs = await getVocabs(vocab_ids, fetch)
				vocab_result.forEach(v => {
					combined_vocab_result.push({
						...v,
						...vocabs.find(_v => _v.id == v.word_id)
					})
				})
			}
			return {
				props: {
					combined_vocab_result,
					tutor_group_lessons: lessons
				}
			}
		}
	}

</script>

<script>
	import {tutor_group_store} from "../../../../../../store";
	import {stores} from "$app/stores";
	import Icon from '../../../../../../components/ui-elements/icon.svelte'
	import Breadcrumb from '../../_breadcrumb.svelte'
	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../store";

	const {session, page} = stores()

	export let combined_vocab_result = []
	export let tutor_group_lessons = []

	tutor_group_store.saveTutorGroupLesson($page.params.tutor_group_id, tutor_group_lessons)

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : null
	$: task = lesson ? lesson.lesson.find(l => l.lesson_id == $page.params.task_id) : null
	$: task_type = task ? task.lesson_type : null

	const type = [
		{
			label: 'Spelling',
			icon: 'vocab',
			key: 'spelling_master',
			task_key: 'spelling-diagnosis'
		},
		{
			label: 'Speaking',
			icon: 'speaking',
			key: 'speaking_master',
			task_key: 'speaking-diagnosis'
		},
		{
			label: 'Comprehension',
			icon: 'reading',
			key: 'comprehension_master',
			task_key: 'comprehension-diagnosis'
		}
	]

	$: type_obj = type.find(t => t.task_key === task_type)

	$: mastered_word_count = combined_vocab_result.filter(r => {
		const type = task_type.split('-')[0]
		return r[`${type}_master`] === 1
	}).length

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<Breadcrumb {tutor_group} {lesson}>Vocab Report</Breadcrumb>

<div class="bg-green-500 text-white text-center py-6 leading-none">
	<p class="text-h1 mb-2">{mastered_word_count}</p>
	<p>New words mastered</p>
	{#if type_obj}
		<div class="px-4 py-2 rounded-full border-white border inline-flex items-center mt-4">
			<Icon name={type_obj.icon}/>
			<p class="ml-2">{type_obj.label}</p>
		</div>
	{/if}
</div>

<div class="p-8">
	<div class="bg-white border border-gray-200">
		{#if combined_vocab_result}
			{#each combined_vocab_result as v}
				<div class="py-4 px-8 border-b border-gray-300 grid grid-cols-3 items-center gap-2 group hover:bg-gray-100">
					<div class="col-span-1">
						<p class="font-bold text-t2">{v.word}</p>
						<p>{v.description}</p>
					</div>
					<div class="col-span-2">
						<div class="flex">
							{#each type as t}
								<div class="{v[t.key] === 1 ? 'text-green-500 bg-white' : 'text-gray-300'} mx-1 p-4 border border-current text-center bg-green-100 rounded">
									<Icon name={t.icon} className="mx-auto w-8"/>
									<p class="text-xs font-bold">{t.label}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>