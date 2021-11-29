<script context="module">
	import {getStudentLessonList, getTutorGroupLessonList} from "../../../../../../api/tutor-api";

	export function load ({page, fetch}) {
		const user_id = page.query.get("user_id")
		if (user_id) {
			getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
		} else {
			getTutorGroupLessonList(page.params.tutor_group_id, fetch, {use_cache: true})
		}
		return true
	}
</script>

<script>
	import {stores} from "$app/stores";
	import {item_store, tutor_group_store} from "../../../../../../store";
	const {page} = stores()

	import Breadcrumb from '../../_breadcrumb.svelte'
	import {onMount} from 'svelte'
	import {left_bar_visible} from "../../../../../../store";

	$: item = $item_store.dict.item[$page.params.item_id]
	$: tutor_group = $tutor_group_store.tutor_group[$page.params.tutor_group_id] || {}
	$: lessons = tutor_group && tutor_group.lessons
	$: lesson = lessons ? lessons.find(l => l.day_id == $page.params.day_id) : {}
	$: tasks = lesson ? lesson.lesson : null
	$: task = tasks ? tasks.find(t => t.lesson_id == $page.params.task_id) : null

	onMount(() => {
		left_bar_visible.set(false)
		return () => left_bar_visible.set(true)
	})
</script>

<Breadcrumb {tutor_group} {lesson}>Instruction</Breadcrumb>

<div class="p-8">
	<div class="p-8 bg-white">
		{#if task}
			<p class="text-gray-400 text-sm mb-2">Title</p>
			<h1 class="text-t1 mb-8">{task.writing_title}</h1>

			<p class="text-gray-400 text-sm mb-2">Instruction</p>
			<p class="text-p2 mb-8">{@html task.writing_instruction}</p>

			<p class="text-gray-400 text-sm mb-2">Attachment</p>
			{#if task.writing_attachment.length}
				{#each task.writing_attachment as attachment}
					<img src={attachment.url} alt="">
				{/each}
			{:else}
				No attachment
			{/if}
		{/if}
	</div>
</div>