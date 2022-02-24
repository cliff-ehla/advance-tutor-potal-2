<script>
	export let course
	import {rc_level_to_label} from "$lib/store/rc-level-to-label.js";
</script>

<a href="/course/{course.tutor_course_id}" class="block p-4 border hover:shadow-lg transition-shadow rounded bg-white border-blue-300 border border-gray-200">
	<p class="text-purple-800 text-sm leading-tight mt-1">{course.sub_cat}</p>
	<p class="text-xs bg-purple-400 rounded-sm font-bold text-white px-2 py-0.5 leading-tight inline-block">
		#{course.description_code_short_id}
	</p>
	<p class="text-xs bg-purple-50 rounded-sm text-purple-500 px-2 py-0.5 leading-tight inline-block">
		{rc_level_to_label[course.rc_level] || course.rc_level}
	</p>
	<div class="text-gray-500 my-2 text-xs leading-tight">{course.title}</div>
	<p class="mt-2 text-sm">
		<span class="text-gray-500">Upcoming lesson:</span>
		<span class="ml-1">{course.upcoming_zoom_cnt}</span>
	</p>
</a>