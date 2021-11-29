<script context="module">
	import {getItemWebview} from "../../../../../../api/item-api";
	import {item_store, tutor_group_store} from "../../../../../../store";
	import {getTutorGroupLessonList} from "../../../../../../api/tutor-api";
	import Breadcrumb from '../../_breadcrumb.svelte'
	export function load ({page, fetch}) {
		getItemWebview(page.params.item_id, page.query.page, fetch, {use_cache: true})
		getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
	}
</script>

<script>
	import {stores} from "@sapper/app";
	const {page} = stores()

	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../store";

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})

	$: item = $item_store.dict.item[$page.params.item_id]
	$: vocabs = item && item.vocabs

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}

	$: webview = item && item[`webview_${$page.query.page}`]
</script>

<Breadcrumb {tutor_group} {lesson}>Webview</Breadcrumb>

{#if webview}
	<iframe class="w-full border" style="height: 90vh" title="preview" src={webview} frameborder="0"></iframe>
{/if}