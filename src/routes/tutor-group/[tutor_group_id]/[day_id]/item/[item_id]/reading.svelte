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
	import ItemReader from '../../../../../../components/item/item-reader/index.svelte'
	import ItemRCD from '../../../../../../components/item/item-rcd/index.svelte'
	import {stores} from "$app/stores";
	const {page} = stores()

	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../store";

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})

	$: item = $item_store.dict.item[$page.params.item_id]
	$: item_type = item ? item.item_type : ''

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}
</script>

<Breadcrumb {tutor_group} {lesson}>Reading</Breadcrumb>
{#if item_type === '2'}
	<ItemReader {item}/>
{:else if item_type === '14'}
	<ItemRCD {item}/>
{:else if item_type === '3'}
	Role play
{:else if item_type === '27'}
	Magic book
{/if}
