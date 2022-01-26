<script context="module">
	import {onFail} from "$lib/http";
	import {course_list_store} from "$lib/store/course_list_store.js";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await course_list_store.cacheFirst(fetch)
		if (!success) return onFail(debug)
		return true
	}
</script>

<script>
	import {capitalize} from "$lib/helper/capitalize.js";
	import {page} from "$app/stores";
	$: tutor_group_id = $page.params.tutor_group_id
	import {tutor_group_store} from "../../../store/index.js";
</script>

<div class="flex">
	<div class="flex-shrink-0 w-60 bg-gray-50 border-r border-gray-200 p-2 h-full overflow-scroll">
		<div class="h-12 flex items-center px-2">
			<p class="section-title">Conversation</p>
		</div>
		<div class="overflow-scroll" style="max-height: calc(100vh - 8em)">
			{#each $course_list_store.one_on_one as course}
				<div class="mb-2">
					{#each course.students as s}
						<a href="/course/conversation/{course.id}"
						   class="flex p-2 bg-white rounded border border-gray-100 transition transform hover:-translate-y-0.5 duration-100 focus:border-blue-500 focus:translate-y-0.5"
						   class:border-blue-300={course.id === tutor_group_id}
						   class:shadow={course.id === tutor_group_id}>
							<div class="w-8 h-8 rounded-full border border-gray-400 relative shadow flex-shrink-0">
								<img src="/student-{s.gender}-icon.png" alt="gender" class="rounded-full">
								<div class="absolute shadow font-bold border border-white -bottom-2 -right-2 ml-2 w-5 h-5 bg-blue-500 rounded-full text-xs cc text-white">{capitalize(s.level)}</div>
							</div>
							<div class="ml-4">
								<span class="text-sm text-gray-700 leading-none">{s.nickname}</span>
								<p class="text-xs leading-none text-gray-500">{course.title.split('(')[0]}</p>
							</div>
						</a>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="flex-1">
		<slot/>
	</div>
</div>
