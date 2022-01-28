<script>
	import dayjs from "dayjs";
	export let message
	import {capitalize} from "$lib/helper/capitalize.js";
</script>

<a href="/conversation/{message.tutor_group_id}"
   class="flex items-center mb-1 px-2 py-1 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 hover:border-gray-300">
	<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
		<img src="/student-{message.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
		<div class="absolute shadow font-bold border border-white -bottom-1 -right-2 ml-2 w-5 h-5 bg-blue-500 rounded-full text-xs cc text-white">{capitalize(message.level)}</div>
	</div>
	<div class="ml-4">
		<p class="text-sm">{message.nickname}</p>
		<div class="flex text-xs">
			<div class="text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap w-40">
				{#if message.image_url}
					[image]
				{:else if message.audio_url}
					[audio]
				{:else}
					{message.message}
				{/if}
			</div>
			<span class="whitespace-nowrap ml-2 text-blue-300">{dayjs(message.create_ts).format('DD MMM')}</span>
		</div>
	</div>
</a>