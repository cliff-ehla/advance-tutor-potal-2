<script context="module">
	import {getTutorGroupLessonList, getTutorGroupStudentList, getStudentLessonList} from "../../../api/tutor-api";
	export function load({page, session, fetch}) {
		const user_id = page.query.get("user_id")
		if (!session) {
			this.redirect(302, '/login')
		} else {
			if (user_id) {
				getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
			} else {
				getTutorGroupLessonList(page.params.tutor_group_id, fetch)
				getTutorGroupStudentList(page.params.tutor_group_id, fetch)
			}
		}
		return true
	}
</script>

<script>
	import {tutor_group_store} from "../../../store";
	import {stores} from "$app/stores";
	import Icon from '../../../components/ui-elements/icon.svelte'
	import TopBar from '../../../components/top-bar.svelte'
	import StudentTopBar from '../../../components/student-top-bar.svelte'
	import GroupClassTopBar from '../../../components/tutor-group/group-class-top-bar.svelte'
	import CourseBreadcrumb from '../../../components/course-breadcrumb.svelte'
	import LessonPreview from '../../../components/lesson/preview.svelte'
	import SideTabs from './_side-tab.svelte'

	const {session, page} = stores()

	import {getContext} from 'svelte'
	const {close} = getContext('simple-modal')
	close()

	$: dict = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = dict && dict.lessons
	$: students = dict && dict.students
	$: user_id = $page.query.user_id
	$: c_id = $page.query.c_id
	$: is_one_on_one = $page.query.user_id
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO(user_id) : null
</script>

{#if user_id && o_o_o}
	<StudentTopBar segment="course" {o_o_o}/>
	<CourseBreadcrumb {user_id} {dict}/>
{:else}
	<GroupClassTopBar back_path="/classes/{c_id}" {c_id} segment="app-tasks" tutor_group={dict}/>
{/if}

<div class="flex w-full">
	<div class="flex-1">
		<SideTabs tutor_group_id={$page.params.tutor_group_id} {user_id} active_tab="tasks">
			{#if lessons}
				{#if lessons.length}
					{#each lessons as item, i}
						<LessonPreview {item} {user_id} {c_id} tutor_group_id={$page.params.tutor_group_id} idx={i}/>
					{/each}
				{:else}
					<p class="p-8">No lessons</p>
				{/if}
			{/if}
		</SideTabs>
	</div>
	{#if !is_one_on_one}
		<div class="ml-1 flex-shrink-0 my-4 border-l border-gray-300" style="width: 200px">
			{#if students}
				<p class="px-4 py-2 font-bold text-gray-400 text-t1">Students</p>
				{#each students as s}
					<div class="flex items-center mb-1 px-4 py-2 hover:bg-gray-200">
						<img src={s.avatar_filepath} class="w-8 h-8 rounded-full"/>
						<p class="ml-2 font-bold text-xs">{s.username}</p>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>