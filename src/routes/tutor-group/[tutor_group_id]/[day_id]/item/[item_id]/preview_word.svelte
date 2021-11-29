<script context="module">
	import {getItem} from "../../../../../../api/item-api";
	import {item_store, tutor_group_store} from "../../../../../../store";
	import {getTutorGroupLessonList} from "../../../../../../api/tutor-api";
	import Breadcrumb from '../../_breadcrumb.svelte'
	export function load ({page, fetch}) {
		getItem(page.params.item_id, fetch, {use_cache: true})
		getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
		return true
	}
</script>

<script>
	import VocabSlider from '../../../../../../components/item/item-vocab/index.svelte'
	import {stores} from "$app/stores";
	const {page} = stores()

	$: item = $item_store.dict.item[$page.params.item_id]
	$: vocabs = item && item.vocabs

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}

	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../store";

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<Breadcrumb {tutor_group} {lesson}>Vocabulary</Breadcrumb>

<div class="py-12 bg-gray-100">
	{#if vocabs}
		<VocabSlider {vocabs}/>
	{/if}
</div>