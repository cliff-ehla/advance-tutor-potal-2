<script>
	import dayjs from "dayjs";
	import Icon from '$lib/ui/icon.svelte'
	import {getContext} from "svelte";
	import tippy from "tippy.js";
	export let zoom
	const {open} = getContext('simple-modal')
	import PdfReaderDialog from '../../components/item/item-pdf-reader/pdf-reader-dialog.svelte'
	import isToday from "dayjs/plugin/isToday.js";
	dayjs.extend(isToday)
	import {zoom_store} from "$lib/store/zoom.js";

	console.log(zoom)

	$: is_today = dayjs(zoom.start_date).isToday()

	const previewMaterial = async (d) => {
		// TODO: leave to tooltip will close the tooltip
		// open(PdfReaderDialog, {
		// 	item_id: d.item_id
		// })
	}

	const onTippy = node => {
		tippy(node, {
			content: 'Open zoom application'
		})
	}
</script>

<div class="p-8 border border-gray-300 w-full bg-white shadow-lg rounded max-w-xl">
	<div class="w-full">
		<div class="text-blue-500 mb-1 text-lg">
			{zoom.sub_cat || zoom.title}
		</div>
		<p class="text-gray-500 text-sm">
			{dayjs(zoom.start_date).format('DD MMM (ddd), h:mma')} - {dayjs(zoom.end_date).format('h:mma')}
<!--			<span class="text-xs font-bold ml-2 bg-gray-100 border border-gray-300 px-1">{$zoom_store.time_zone.label}</span>-->
		</p>
		<div class="my-4">
		{#each zoom.days as d}
			<div on:click={() => {previewMaterial(d)}} class="cursor-pointer hover:text-blue-700 hover:bg-gray-200 my-2 group px-4 py-3 bg-gray-100 shadow rounded border-gray-300 border">
				<p class="leading-tight">{d.title}</p>
			</div>
		{/each}
		</div>
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
				<a href="/students/{s.user_id}" class="inline-flex items-center mr-2 bg-blue-200 rounded-full mt-1 overflow-hidden border border-white hover:border-blue-300">
					<div class="w-6 h-6 rounded-full mr-1 cc text-xs bg-blue-500 text-white">{s.level.charAt(0).toUpperCase() + s.level.slice(1)}</div>
					<span class="text-sm py-1">{s.nickname}</span>
					<div class="w-8 cc bg-white h-8 bg-opacity-50 ml-2">
						<Icon name="report" className="w-3.5 text-gray-400 inline-block"/>
					</div>
				</a>
			{/each}
		{/if}
	</div>
	{#if is_today}
		<div class="mt-4">
			<div class="flex items-center">
				<a href="/zoom/{zoom.wrapper_id}" class="bg-gradient-to-b from-green-500 to-green-700 hover:shadow transition-transform transform hover:-translate-y-0.5 text-white py-1.5 rounded-full flex-1 flex items-center justify-center">
					Start class
				</a>
				<a use:onTippy href={zoom.zoom_link} class="bg-white border-2 border-blue-500 text-blue-500 rounded-full cc ml-2 w-12 h-12">
					<Icon name="zoom" className="w-8"/>
				</a>
			</div>
		</div>
	{/if}
</div>