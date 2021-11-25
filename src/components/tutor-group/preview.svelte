<script>
	export let group
	export let user_id = undefined
	export let c_id = undefined
</script>

<a href="/tutor-group/{group.tutor_group_id}/app-tasks{user_id ? `?user_id=${user_id}` : c_id ? `?c_id=${c_id}` : ''}" class="rounded-lg overflow-hidden block border border-gray-300 transition-all transform hover:-translate-y-2 hover:shadow-lg">
	<div class="text-white px-8 py-4" style="background-color: {group.color}">
		<h2 class="font-bold text-t1 mb-2">{group.title}</h2>
		<div class="flex text-sm items-center leading-none">
			<p>{group.subtitle}</p>
			{#if group.whitebox}
				<p class="ml-2 text-xs rounded-full border border-gray-300 px-2 py-1">{group.whitebox}</p>
			{/if}
		</div>
	</div>
	<div class="px-8 py-4 bg-white text-sm text-gray-500">
		<div class="flex mb-2">
			<div class="w-40 text-gray-400">Teachers</div>
			<p>{group.teacher_names}</p>
		</div>

		{#if !user_id}
			<div class="flex mb-2">
				<div class="w-40 text-gray-400">Number of Students</div>
				<p>{group.number_of_students}</p>
			</div>
		{/if}

		<div class="flex mb-2">
			<div class="w-40 text-gray-400">Start date:</div>
			<p>{group.start_date}</p>
		</div>

		<div class="flex">
			<div class="w-40 text-gray-400">Progress</div>
			<p>{group.completion_cnt}/{group.total_lesson_cnt} lesson(s)</p>
		</div>
	</div>
</a>