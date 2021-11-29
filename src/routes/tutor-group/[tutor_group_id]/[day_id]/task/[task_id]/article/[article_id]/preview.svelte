<script context="module">
	import {getSelfieArticle} from "../../../../../../../../api/selfie-api";
	import {getStudentLessonList, getTutorGroupLessonList} from "../../../../../../../../api/tutor-api";

	export async function load ({page, fetch}) {
		const user_id = page.query.get("user_id")
		let tutor_group_list
		if (user_id) {
			tutor_group_list = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
		} else {
			tutor_group_list = await getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
		}
		const res = await getSelfieArticle({
			article_id: page.params.article_id,
			child_id: page.query.user_id
		}, fetch)
		return {
			props: {
				sentences: res.sentences,
				tutor_group_list
			}
		}
	}
</script>

<script>
	import {stores} from "$app/stores";
	import {item_store, tutor_group_store} from "../../../../../../../../store";

	const {page} = stores()

	export let sentences
	export let tutor_group_list
	tutor_group_store.saveTutorGroupLesson(tutor_group_list)

	import Breadcrumb from '../../../../_breadcrumb.svelte'
	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../../../store";

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

{#if sentences}
<div class="p-8">
	<div class="px-16 oy-4 bg-white border border-gray-300 rounded">
		{#each sentences as s}
			<p class="py-8 border-b border-gray-200 text-p2">{s.sentence}</p>
		{/each}
	</div>
</div>
{/if}