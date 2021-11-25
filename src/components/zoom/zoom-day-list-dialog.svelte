<script>
	export let zoom_list
	export let date

	import dayjs from "dayjs";
	import Preview from './preview.svelte'
</script>

<div class="p-4 bg-blue-100 font-bold text-blue-500 rounded-t">
	<h1 class="text-t1">{dayjs(date).format('DD MMM YYYY')}</h1>
</div>

<div class="overflow-scroll p-4" style="max-height: calc(100vh - 8em)">
	{#if zoom_list.length > 0}
		{#each zoom_list as z}
			<div class="mb-4">
				<Preview {z} tutor_group_id={z.tutor_group_id}/>
			</div>
		{/each}
	{:else}
		<div class="p-8">
			No lesson(s)
		</div>
	{/if}
</div>