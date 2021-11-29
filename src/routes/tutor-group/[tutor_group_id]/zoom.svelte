<script context="module">
	import {getStudentZoomList} from "../../../api/zoom-api";

	export function load ({page, fetch}) {
		getStudentZoomList(page.params.tutor_group_id, page.query.get("user_id"), fetch)
		return true
	}
</script>

<script>
	import SideTab from './_side-tab.svelte'
	import StudentTopBar from '../../../components/student-top-bar.svelte'
	import GroupClassTopBar from '../../../components/tutor-group/group-class-top-bar.svelte'
	import Icon from '../../../components/ui-elements/icon.svelte'
	import Preview from '../../../components/zoom/preview.svelte'
	import {getZoomListTimeCategory} from "../../../store/get-zoom-list-time-category";

	import {getContext} from 'svelte'
	const {open} = getContext('simple-modal')
	import {stores} from '$app/stores'
	import {tutor_group_store} from "../../../store";
	const {page, session} = stores()

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: user_id = $page.query.get("user_id")
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO(user_id) : null
	$: zoom_list = $tutor_group_store ? tutor_group_store.getZoomList($page.params.tutor_group_id) : null
	$: category_list = zoom_list ? getZoomListTimeCategory(zoom_list) : null
</script>

{#if user_id && o_o_o}
	<StudentTopBar segment="course" {o_o_o}/>
{:else if tutor_group}
	<GroupClassTopBar segment="zoom" {tutor_group}/>
{/if}

<SideTab {user_id} tutor_group_id={$page.params.tutor_group_id} active_tab="zoom">
	<div class="p-8 max-w-screen-lg">
		{#if category_list}
			{#each category_list as cat}
				<div class="mb-12">
					<h2 class="font-bold text-black mb-4">{cat.title}</h2>
					{#if cat.zoom_list.length}
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{#each cat.zoom_list as z}
								<div class="mb-8">
									<Preview {z} tutor_group_id={z.tutor_group_id}/>
								</div>
							{/each}
						</div>
					{:else}
						<div class="p-8 bg-white rounded">
							<p>No class</p>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</SideTab>
