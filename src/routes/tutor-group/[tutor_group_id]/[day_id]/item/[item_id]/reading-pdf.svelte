<script context="module">
	import {getItem} from "../../../../../../api/item-api";
	import {item_store, tutor_group_store} from "../../../../../../store";
	import {getTutorGroupLessonList} from "../../../../../../api/tutor-api";
	import Breadcrumb from '../../_breadcrumb.svelte'
	import Icon from '../../../../../../components/ui-elements/icon.svelte'
	export function load ({page, fetch}) {
		getItem(page.params.item_id, fetch, {use_cache: true})
		getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
		return true
	}
</script>

<script>
	import PdfReader from '../../../../../../components/item/item-pdf-reader/index.svelte'
	import {stores} from "$app/stores";
	const {page, session} = stores()

	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../store";
	$: tutor_group_id = $page.params.tutor_group_id

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})

	$: item = $item_store.dict.item[$page.params.item_id]
	$: pdf_json = item && item.pdf_json
	$: youtube_links = item && item.youtube_link
	$: ppt_link = item && item.ppt_link

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}

	$: {
		if (ppt_link) {
			window.open(ppt_link, '_blank').focus();
		}
	}
</script>

{#if tutor_group.tutor_group_id}
	<Breadcrumb {tutor_group} {lesson}>PDF</Breadcrumb>
{:else}
	<button on:click={() => {history.back()}} class="ml-4 mt-4 w-10 h-10 rounded-full bg-white hover:text-blue-500 flex items-center justify-center">
		<Icon name="right" className="w-4 transform rotate-180 text-gray-500"/>
	</button>
{/if}

{#if pdf_json}
	<PdfReader {youtube_links}
	           pages_info_2={pdf_json}
	           item_id={$page.params.item_id}
	           tutor_group_id={$page.params.tutor_group_id}
	           teacher_id={$session.user_id}
	           student_id={$page.query.user_id}
	           zoom_id={$page.query.zoom_id}/>
{/if}
