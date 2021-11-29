<script context="module">
	import {getStudentZoomList} from "../../../api/zoom-api";

	export function load ({page, fetch}) {
		getStudentZoomList(page.params.tutor_group_id, page.query.user_id, fetch)
		return true
	}
</script>

<script>
	import dayjs from "dayjs";
	import SideTab from './_side-tab.svelte'
	import RateLabel from '../../../components/zoom/rate-label.svelte'
	import StudentTopBar from '../../../components/student-top-bar.svelte'
	import GroupClassTopBar from '../../../components/tutor-group/group-class-top-bar.svelte'
	import PdfReaderDialog from '../../../components/item/item-pdf-reader/pdf-reader-dialog.svelte'
	import {getContext} from 'svelte'
	const {open} = getContext('simple-modal')
	import {stores} from '$app/stores'
	import {tutor_group_store} from "../../../store";
	const {page, session} = stores()

	let history = []

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: user_id = $page.query.get("user_id")
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO(user_id) : null
	$: zoom_list = $tutor_group_store ? tutor_group_store.getZoomList($page.params.tutor_group_id) : null
	$: {
		if (zoom_list) {
			const days = zoom_list.reduce((acc, zoom) => {
				zoom.days.forEach(d => {
					d.start_date = zoom.start_date
				})
				return [...zoom.days, ...acc]
			}, [])
			history = days
		}
	}

	const onPreview = async (history) => {
		open(PdfReaderDialog, {
			item_id: history.item_id
		})
	}
</script>

{#if user_id && o_o_o}
	<StudentTopBar segment="course" {o_o_o}/>
{:else if tutor_group}
	<GroupClassTopBar segment="zoom" {tutor_group}/>
{/if}

<SideTab user_id={$page.query.get("user_id")} tutor_group_id={$page.params.tutor_group_id} active_tab="class-history">

	<div class="p-4">
	{#each history as h}
		<div on:click={() => {onPreview(h)}} class="bg-white border border-gray-200 mb-4 rounded hover:shadow-lg transform transition-transform hover:translate-y-1 px-4 py-3 flex items-center border-b border-gray-200 group cursor-pointer">
			<div class="w-20 h-20 bg-cover rounded" style="background-image: url({h.thumbnail_path})"></div>
			<div class="mx-4 flex-1">
				<p class="text-gray-500 mb-2">{dayjs(h.start_date).format('DD MMM YYYY')}</p>
				<p>{h.title}</p>
			</div>

			<div class="mr-4">
				<RateLabel rate={h.t_difficulty_rate}/>
			</div>

			<button class="bg-blue-500 text-white px-4 py-2 rounded group-hover:bg-blue-700">Preview</button>
		</div>
	{/each}
	</div>
</SideTab>