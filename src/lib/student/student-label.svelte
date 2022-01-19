<script>
	export let student
	import {capitalize} from "$lib/helper/capitalize.js";
</script>

<div class="inline-flex items-center mr-2 bg-gray-50 border border-blue-300 rounded-full mt-1">
	<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
		<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full">
		<div class="absolute -bottom-2 -right-2 ml-2 w-5 h-5 bg-blue-500 rounded-full text-xs cc text-white">{capitalize(student.level)}</div>
	</div>
	<span class="text-sm pr-4 py-1 ml-2">{student.nickname}</span>
</div>