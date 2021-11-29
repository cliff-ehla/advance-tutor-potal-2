<script context="module">
	import {getAudioFeedback} from "../../../../../../api/course-api";
	import {getStudentLessonList} from "../../../../../../api/tutor-api";

	export async function load ({page, fetch}) {
		let { task_id, tutor_group_id, day_id} = page.params
		const user_id = page.query.get("user_id")
		let child_id = page.query.get("user_id")
		const lessons = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
		const data = await getAudioFeedback({
			lesson_id: task_id, tutor_group_id, day_id, child_id
		}, fetch)
		return {
			props: {
				audios: data,
				lessons
			}
		}
	}
</script>

<script>
	import Breadcrumb from '../../_breadcrumb.svelte'
	import {stores} from "$app/stores";
	import {tutor_group_store} from "../../../../../../store";
	const {page} = stores()

	export let audios
	export let lessons

	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}
	$: tasks = lesson ? lesson.lesson : null
	$: task = tasks ? tasks.find(t => t.lesson_id == $page.params.task_id) : null
</script>

<Breadcrumb {tutor_group} {lesson}>Audio submission</Breadcrumb>

<div class="p-8">
	<h2 class="text-t1 font-bold mb-8">Student's recording</h2>
	{#if audios}
		{#each audios as a}
			<audio controls src={a.url}/>
		{/each}
	{/if}
</div>