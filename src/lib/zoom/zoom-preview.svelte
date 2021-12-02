<script>
	import dayjs from "dayjs";
	import Icon from '$lib/ui/icon.svelte'
	import {getContext} from "svelte";
	export let zoom
	const {open} = getContext('simple-modal')
	import PdfReaderDialog from '../../components/item/item-pdf-reader/pdf-reader-dialog.svelte'
	import isToday from "dayjs/plugin/isToday.js";
	dayjs.extend(isToday)

	$: is_today = dayjs(zoom.start_date).isToday()

	const previewMaterial = async (d) => {
		open(PdfReaderDialog, {
			item_id: d.item_id
		})
	}
</script>

<div class="p-2 flex w-full">
	<div class="w-24 flex-shrink-0">
		<p class="text-gray-500">{dayjs(zoom.start_date).format('H:mma')}</p>
	</div>
	<div class="w-full">
		{#each zoom.days as d}
			<p on:click={() => {previewMaterial(d)}} class="cursor-pointer hover:text-blue-700 mb-1">
				<Icon name="pdf" className="inline-block w-5 mr-2 text-gray-400"/>{d.title} <Icon name="right" className="inline-block w-3"/>
			</p>
		{/each}
		{#if zoom.is_big_classroom}
			{#each zoom.students as s}
				<div class="inline-flex items-center mr-2 bg-blue-200 rounded-full mt-1">
					<div class="w-6 h-6 rounded-full mr-1 cc text-xs bg-blue-500 text-white">{s.level.charAt(0).toUpperCase() + s.level.slice(1)}</div>
					<span class="text-sm pr-2 py-1">{s.nickname}</span>
				</div>
			{/each}
		{:else}
			<div>
				<a href="/tutor-group/{zoom.tutor_group_id}" class="text-xs text-gray-500 hover:text-red-500 inline-block">Course: {zoom.title}</a>
				<Icon name="chat" className="w-3.5 text-gray-400 inline-block ml-0.5"/>
			</div>
			{#if zoom.f_one_on_one}
			{:else}
			{/if}
			{#each zoom.students as s}
				<a href="/students/{s.user_id}" class="inline-flex items-center mr-2 bg-blue-200 rounded-full mt-1 overflow-hidden">
					<div class="w-6 h-6 rounded-full mr-1 cc text-xs bg-blue-500 text-white">{s.level.charAt(0).toUpperCase() + s.level.slice(1)}</div>
					<span class="text-sm py-1">{s.nickname}</span>
					<div class="w-8 cc bg-white h-8 bg-opacity-50 ml-2">
						<Icon name="report" className="w-3.5 text-gray-400 inline-block"/>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>
{#if is_today}
	<div class="ml-24 px-2 pb-2">
		<a href="/zoom/{zoom.wrapper_id}" class="block bg-green-500 text-white w-full py-2 rounded-full text-center">Join the class now</a>
	</div>
{/if}