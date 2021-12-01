<script>
	import dayjs from "dayjs";
	export let zoom
</script>

<div class="p-2 flex">
	<div class="w-24">
		<p class="text-gray-500">{dayjs(zoom.start_date).format('H:mma')}</p>
	</div>
	<div>
		{#each zoom.days as d}
			<p>{d.title}</p>
		{/each}
		{#if zoom.f_one_on_one}
			<span class="text-red-500">{zoom.title}</span>
		{/if}
		{#each zoom.students as s}
			<span class="text-blue-500 mr-2">{s.nickname} ({s.level})</span>
		{/each}
	</div>
</div>