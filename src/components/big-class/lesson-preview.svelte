<script>
	export let item
	import dayjs from "dayjs";
</script>

<div class="flex">
	<img src={item.thumbnail_path} alt="hi" class="rounded w-28">
	<div class="ml-4 flex flex-col p-2">
		<p class="text-blue-500">{item.category}</p>
		<p class="font-bold">{item.title}</p>
		<p class="text-gray-500 text-sm mt-2">{item.level}</p>
		<p class="text-gray-500 text-sm">{item.teacher}</p>
		<div class="mt-auto">
<!--			<div class="bg-blue-500 text-white px-2 py-1 leading-none inline-block rounded-full text-sm">Big class</div>-->
			<p class="mt-2 text-blue-500 text-sm">{dayjs(item.start_time).format('DD MMM YYYY HH:mma')}</p>
		</div>
	</div>
</div>
