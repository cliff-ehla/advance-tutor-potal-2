<script context="module">
	import {getSelfieVocab} from "../../../../../../../../api/selfie-api";
	import {getStudentLessonList, getTutorGroupLessonList} from "../../../../../../../../api/tutor-api";
	import {getVoicesReport} from "../../../../../../../../api/voice-api";

	export async function load ({page, fetch}) {
		const user_id = page.query.get("user_id")
		let tutor_group_list
		if (user_id) {
			tutor_group_list = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
		} else {
			tutor_group_list = await getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
		}
		let res = await getSelfieVocab(page.params.vocab_list_id, page.query.user_id, fetch)
		let result = res.dictation_result_json
		let words = res.words

		const {task_id, tutor_group_id, day_id} = page.params
		const child_id = page.query.user_id
		let vocabs = words.map(w => w.word)
		const voice_report  = await getVoicesReport({lesson_id: task_id, tutor_group_id, day_id, child_id, vocabs}, fetch)
		const vocabs_report = voice_report ? voice_report.vocab : []
		
		words.forEach(w => {
			let obj = result[w.word_id]
			let attempts = obj ? obj.recentAttempts : null
			w.is_correct = attempts ? (attempts[0] && attempts[1]) :  false
			let obj2 = vocabs_report.find(r => r.word === w.word)
			w.voice_result = obj2 ? obj2.json.Overall : null
		})
		return {
			props: {
				vocabs: res.words,
				tutor_group_list
			}
		}
	}
</script>

<script>
	import {stores} from "$app/stores";
	import {item_store, tutor_group_store} from "../../../../../../../../store";

	const {page} = stores()

	export let vocabs
	export let tutor_group_list

	tutor_group_store.saveTutorGroupLesson($page.params.tutor_group_id, tutor_group_list)

	import Breadcrumb from '../../../../_breadcrumb.svelte'
	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../../../store";
	import Icon from '../../../../../../../../components/ui-elements/icon.svelte'

	$: item = $item_store.dict.item[$page.params.item_id]
	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}

	$: correct_cnt = vocabs.filter(v => v.is_correct).length
	$: total_cnt = vocabs.length

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<Breadcrumb {tutor_group} {lesson}>Result</Breadcrumb>

<div class="bg-green-500 text-white text-center py-8 leading-none">
	<p class="mb-2 inline-flex items-end">
		<span class="text-h1 font-bold">{correct_cnt}</span>
		<span class="mb-1 ml-2">/ {total_cnt}</span>
	</p>
	<p class="text-t1">Score</p>
</div>

{#if vocabs && vocabs.length}
	<div class="p-8">
		<div class="p-8 bg-white rounded border border-gray-300">
			{#each vocabs as v}
				<div class="p-8 flex items-center border-b border-gray-200">
					<div class="flex-1">
						<p class="text-t1 font-bold mb-1">{v.word}</p>
						<p class="text-sm">{v.translation || v.description_alter}</p>
					</div>
					<div class="ml-4 {v.voice_result ? '' : 'text-gray-400'} border border-gray-300 rounded p-2">
						<div class="h-8 cc">
							{#if v.voice_result}
								<p class="text0gray-500 text-h1">{v.voice_result}</p>
							{:else}
								<span class="text-xxs text-gray-300">No recording</span>
							{/if}
						</div>
						<div class="inline-flex">
							<Icon name="speaking" className="w-4 mr-1"/>
							<p class="text-sm">Speaking</p>
						</div>
					</div>
					<div class="ml-4 {v.is_correct ? 'text-green-500' : 'text-red-500'} border border-gray-300 rounded p-2">
						<div class="h-8 cc">
							<Icon name={v.is_correct ? 'tick' : 'cross'} className="w-8 mx-auto"/>
						</div>
						<div class="inline-flex">
							<Icon name="edit" className="w-4 mr-1"/>
							<p class="text-sm">Dictation</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}