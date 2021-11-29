<script context="module">
	import {getTutorGroupLessonList} from "../../../../../api/tutor-api";
	import {getVideoItems} from "../../../../../api/item-api";
	import Breadcrumb from '../_breadcrumb.svelte'
	export function load ({page, fetch}) {
		getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
		const item_ids = page.query.item_ids.split(',')
		getVideoItems(item_ids, fetch, {use_cache: true})
		return true
	}
</script>

<script>
	import {stores} from '$app/stores'
	import {tutor_group_store, item_store} from "../../../../../store";

	const {page} = stores()

	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../store";

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}

	$: item_ids = $page.query.item_ids.split(',')
	$: video_items =  item_ids.map(id => $item_store.dict.item[id]).filter(i => !!i)
</script>

<Breadcrumb {tutor_group} {lesson}>Tutorial videos</Breadcrumb>

<div class="p-6">
	{#if video_items}
		{#each video_items as item}
			<video style="max-width: 600px" class="mb-4 rounded" src={item.media[0].file_path} controls></video>
		{/each}
	{/if}
</div>
