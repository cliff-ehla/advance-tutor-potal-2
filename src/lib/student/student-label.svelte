<script>
	export let student
	import {capitalize} from "$lib/helper/capitalize.js";
</script>

<a href="/students/{student.user_id || student.id}" class="inline-flex items-center mr-2 bg-gray-50 border border-blue-300 hover:border-blue-500 hover:bg-white rounded-full mt-1">
	<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
		<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
		<div class="absolute shadow font-bold border border-white -bottom-2 -right-4 ml-2 w-7 h-7 bg-blue-500 rounded-full text-sm cc text-white">{capitalize(student.level)}</div>
	</div>
	<span class="text-sm pr-4 py-1 ml-4">{student.nickname}</span>
</a>