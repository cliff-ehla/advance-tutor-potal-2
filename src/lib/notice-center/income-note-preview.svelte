<script>
	import dayjs from "dayjs";
	export let message
	$: m = message
</script>

<a href="/conversation/{m.tutor_group_id}" class="flex items-center mb-1 px-2 py-1 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 hover:border-gray-300">
	<div class="w-8 flex-shrink-0">
		<img src="/logo.png" alt="icon" class="rounded-full w-8 mx-auto">
	</div>
	<div class="ml-4">
		<p class="text-sm text-gray-700">Note for {m.nickname}</p>
		<div class="flex items-center text-xs">
			<p class="text-xs text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap w-40">
				{m.note}
			</p>
			<span class="whitespace-nowrap ml-2 text-blue-300">{dayjs(m.create_ts).format('DD MMM')}</span>
		</div>
	</div>
</a>