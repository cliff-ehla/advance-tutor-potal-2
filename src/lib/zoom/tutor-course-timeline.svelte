<script>
	export let existing_classroom
	import dayjs from "dayjs";
	const isPast = (classroom) => {
		return dayjs.utc(classroom.start_date).local().isBefore(dayjs())
	}
</script>

{#each existing_classroom as classroom, i}
	<div class="flex relative pb-2">
		<div class="cc z-10 flex-shrink-0 w-4 h-4 border border-green-500 rounded-full {!isPast(classroom) ? 'bg-white' : 'bg-green-500'}"></div>
		{#if i < existing_classroom.length - 1}
			<div class="transform -translate-x-1/2 absolute w-0.5 bg-green-500 inset-y-0 ml-2 top-0 h-full"></div>
		{/if}
		<div class="ml-4">
			<p class="text-gray-500 text-sm">
				<span>{dayjs.utc(classroom.start_date).local().format('DD MMM (ddd), h:mma')}</span>
			</p>
			<div>{classroom.title}</div>
		</div>
	</div>
{/each}