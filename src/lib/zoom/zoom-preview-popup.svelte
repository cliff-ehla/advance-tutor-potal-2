<script>
	import dayjs from "dayjs";
	import Icon from '$lib/ui/icon.svelte'
	import {getContext} from "svelte";
	import {tooltip} from "$lib/aciton/tooltip.js";
	export let zoom
	const {open} = getContext('simple-modal')
	import PdfReaderDialog from '$lib/pdf-reader/pdf-reader-dialog.svelte'
	import RateLabel from '$lib/zoom/rate-label.svelte'
	import isToday from "dayjs/plugin/isToday.js";
	dayjs.extend(isToday)
	import CoursePreviewPopup from '$lib/zoom/course-preview-popup.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import StudentLabel from '$lib/student/student-label.svelte'
	import {capitalize} from "$lib/helper/capitalize.js";
	import {zoom_store} from '$lib/store/zoom.js'

	$: is_today = dayjs(zoom.start_date).isToday()
	$: is_ended = dayjs().isAfter(dayjs(zoom.end_date))
	$: student_id = zoom.students.length ? zoom.students[0].user_id : undefined
	$: is_classroom = zoom.is_big_classroom
	$: duration = zoom.duration || dayjs(zoom.end_date).diff(dayjs(zoom.start_date), 'minute')
	const default_max_student_display = 5
	let max_student_display = default_max_student_display

	const previewMaterial = async (d) => {
		open(PdfReaderDialog, {
			item_id: d.item_id
		}, {
			padding: 0,
			bg_class: 'transparent',
			width: '100%'
		})
	}
</script>

<div class="p-8 border border-gray-300 w-full bg-white shadow-lg rounded overflow-y-auto" style="max-width: 400px; max-height: 600px">
	<div class="w-full">
		<div class="text-blue-500 mb-1 text-lg">
			<div class="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white border border-gray-200 shadow">
				{#if is_classroom}
					<Icon name="classroom" className="w-8 text-purple-500 absolute top-4 right-4"/>
				{:else}
					<Icon name="one-on-one" className="w-8 text-blue-500 absolute top-4 right-4"/>
				{/if}
			</div>
			{#if is_classroom}
				<p class="text-xs bg-purple-400 rounded-sm text-white px-2 leading-tight inline-block">{capitalize(zoom.rc_level)}</p>
				<div class="text-purple-500 leading-tight">{zoom.sub_cat || zoom.sub_cat_en}</div>
			{:else}
				<div class="text-blue-500">
					<Dropdown activator_style="inline-block" placement="right" caveat_visible>
						<a use:tooltip={'Click to check details'} slot="activator" href="/students/{student_id}/tutor-group/{zoom.tutor_group_id}">
							{zoom.title.split('(')[0]}
						</a>
						<div class="">
							<CoursePreviewPopup tutor_group_id={zoom.tutor_group_id}/>
						</div>
					</Dropdown>
				</div>
			{/if}
		</div>
		<div class="flex items-center">
			<Icon name="calendar" className="w-4 text-gray-400"/>
			<p class="text-gray-500 text-sm ml-2 mr-2">{dayjs(zoom.start_date).format('DD MMM (ddd), h:mma')} - {dayjs(zoom.end_date).format('h:mma')}</p>
			<p style="font-size: 8px" class="ml-auto bg-gray-100 border border-gray-300 px-1">{$zoom_store.time_zone.label}</p>
		</div>
		<div class="flex">
			<Icon name="stopwatch" className="w-4 text-gray-400"/>
			<p class="text-gray-500 text-sm ml-2">{duration}min</p>
		</div>
		<div class="my-4">
			{#if zoom.days.length}
				{#each zoom.days as d}
					<div class="relative">
						<div use:tooltip={'Preview material'} on:click={() => {previewMaterial(d)}} class="cursor-pointer hover:text-blue-700 hover:bg-gray-200 my-2 group px-4 py-3 bg-gray-100 shadow rounded border-gray-300 border">
							<p class="leading-tight">{d.title}</p>
						</div>
						{#if is_ended && !is_classroom}
							<div class="ml-4 absolute -top-3 -right-4">
								<RateLabel {student_id} item_id={d.item_id} rate={d.t_difficulty_rate}/>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="text-gray-300 my-2 group px-4 py-3 bg-gray-100 rounded border-gray-300 border">
					No material yet
				</div>
			{/if}
		</div>
		{#if zoom.students.length}
			{#each zoom.students.slice(0,max_student_display) as s}
				<StudentLabel student={s}/>
			{/each}
			{#if zoom.students.length > default_max_student_display}
				{#if max_student_display === 9999}
					<span class="text-sm text-blue-500 hover:text-blue-700 cursor-pointer whitespace-nowrap"
					      on:click|stopPropagation={() => {max_student_display = 4}}>
						show less
					</span>
				{:else}
					<span class="text-sm text-blue-500 hover:text-blue-700 cursor-pointer whitespace-nowrap"
					      on:click|stopPropagation={() => {max_student_display = 9999}}>
						...{zoom.students.length - max_student_display}+ more
					</span>
				{/if}
			{/if}
		{:else}
			<div class="text-sm text-gray-300 border border-gray-200 rounded-full px-4 py-1 inline-block">Classroom is empty</div>
		{/if}
	</div>
	{#if is_today}
		<div class="mt-4">
			<div class="flex items-center">
				<a use:tooltip={'Open lesson material'} href="/zoom/{zoom.wrapper_id}" class="bg-gradient-to-b from-green-500 to-green-700 hover:shadow transition-transform transform hover:-translate-y-0.5 text-white py-1.5 rounded-full flex-1 flex items-center justify-center">
					Start class
				</a>
				<a use:tooltip={'Open zoom application'} href={zoom.zoom_link} class="bg-white border-2 border-blue-500 text-blue-500 rounded-full cc ml-2 w-12 h-12">
					<Icon name="zoom" className="w-8"/>
				</a>
			</div>
		</div>
	{/if}
</div>