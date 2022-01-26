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
</script>

<div class="flex">
	<div class="w-60 bg-gray-50 border-r border-gray-200">
		{#each $course_list_store.one_on_one as course}
			<div class="px-4 py-2">
				{#each course.students as s}
					<div class="flex">
						<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
							<img src="/student-{s.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
							<div class="absolute shadow font-bold border border-white -bottom-2 -right-4 ml-2 w-7 h-7 bg-blue-500 rounded-full text-sm cc text-white">{capitalize(s.level)}</div>
						</div>
						<div class="ml-4">
							<span class="text-sm py-1">{s.nickname}</span>
							<p class="text-xs">{course.title.split('(')[0]}</p>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="ml-4">
		<slot/>
	</div>
</div>