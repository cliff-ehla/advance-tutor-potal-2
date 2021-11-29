<script context="module">
	import {getSelfieVocab} from "../../../../../../../../api/selfie-api";
	import {getStudentLessonList, getTutorGroupLessonList} from "../../../../../../../../api/tutor-api";

	export async function load ({page, fetch}) {
		const user_id = page.query.get("user_id")
		let tutor_group_list
		if (user_id) {
			tutor_group_list = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
		} else {
			tutor_group_list = await getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
		}
		let res = await getSelfieVocab(page.params.vocab_list_id, page.query.user_id, fetch)
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
	tutor_group_store.saveTutorGroupLesson(tutor_group_list)

	import Breadcrumb from '../../../../_breadcrumb.svelte'
	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../../../store";
	import VocabSlider from '../../../../../../../../components/item/item-vocab/index.svelte'

	$: item = $item_store.dict.item[$page.params.item_id]
	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<Breadcrumb {tutor_group} {lesson}>Preview</Breadcrumb>

{#if vocabs && vocabs.length}
	<div class="p-16">
		<VocabSlider {vocabs}/>
	</div>
{/if}