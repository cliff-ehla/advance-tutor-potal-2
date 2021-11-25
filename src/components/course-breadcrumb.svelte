<script>
	import Icon from './ui-elements/icon.svelte'
	export let user_id
	export let dict
	export let lesson_type = undefined
	export let lesson = undefined
</script>

<div class="text-sm px-4 flex items-center border-b border-gray-300 bg-white">
	<a href="/student/{user_id}/course" class="p-2 px-2 hover:bg-gray-200">
		Course
	</a>
	<Icon name="right" className="w-3"/>
	<a href="/tutor-group/{dict.tutor_group_id}/app-tasks?user_id={user_id}" class="mx-2 py-0.5 px-2 text-white rounded" style="background: {dict.color}">{dict.title}</a>
	{#if lesson && lesson_type}
		<Icon name="right" className="w-3"/>
		<div class="inline-flex px-2 items-center">
			<div class="w-6 h-6 rounded-full cc {lesson_type.color} text-white">
				<Icon className="w-4" name="{lesson_type.icon}"/>
			</div>
			<p class="ml-2">{lesson.title}</p>
		</div>
	{/if}
</div>