<script>
	import {formatDate} from "../../helpers/date";
	import ProgressBar from '../ui-elements/progress-bar.svelte'
	import Icon from '../ui-elements/icon.svelte'
	import {lesson_type} from "../../store";

	export let item
	export let user_id = undefined
	export let c_id = undefined
	export let tutor_group_id
	export let idx
	export let is_zoom_wrapper = false

	$: is_one_on_one = !!user_id
</script>

<a href="/tutor-group/{tutor_group_id}/{item.day_id}{user_id ? `?user_id=${user_id}` : c_id ? `?c_id=${c_id}` : ''}" class="group transition-colors hover:bg-white py-4 px-4 border-b border-gray-300 flex items-center">
	<div class="{$lesson_type[item.type] && $lesson_type[item.type].color} w-10 h-10 rounded-full flex justify-center items-center text-white flex-shrink-0 self-start mt-1">
		<Icon name={$lesson_type[item.type] && $lesson_type[item.type].icon}/>
	</div>
	<div class="ml-4 flex-1">
		<p class="text-gray-700 text-t1 group-hover:text-black group-hover:text-blue-500">
			<span class="text mr-1">{idx + 1}.</span>
			{$lesson_type[item.type] && $lesson_type[item.type].title || item.type}</p>
		<p class="text-gray-400 leading-tight text-sm mt-1">{item.description}</p>

		{#if !is_zoom_wrapper}
			<p class="text-xs mt-4 text-gray-400">
				<span>Scheduled at</span>
				<span class="text-gray-700">{formatDate(item.start_time)}</span>
			</p>
			{#if item.lesson.length === 0}
				<div class="bg-red-500 text-white px-2 py-1 rounded-sm text-xs inline-block">
					內容設置未完成
				</div>
			{/if}
		{/if}
	</div>
	{#if !is_zoom_wrapper}
		<div class="ml-4 text-right">
			<p class="text-xs font-bold text-gray-400 whitespace-nowrap mb-2">Task completion</p>
			{#if is_one_on_one}
				<div class="flex justify-center">
					<ProgressBar total={item.total_lesson_cnt} completed={item.completed_lesson_cnt}/>
				</div>
			{:else}
				<div class="bg-gray-200 relative rounded-full overflow-hidden h-1.5 mt-1">
					<div class="absolute bg-green-500 inset-y-0 left-0" style="width: {item.completed_count / item.total_count * 100}%"></div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="ml-4 text-gray-400 group-hover:text-blue-500">
			<Icon name="right"/>
		</div>
	{/if}
</a>