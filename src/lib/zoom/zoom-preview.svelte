<script>
	import dayjs from "dayjs";
	import Icon from '$lib/ui/icon.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import {getContext} from "svelte";
	import tippy from "tippy.js";
	export let zoom
	const {open} = getContext('simple-modal')
	import PdfReaderDialog from '$lib/pdf-reader/pdf-reader-dialog.svelte'
	import CoursePreviewPopup from '$lib/zoom/course-preview-popup.svelte'
	import RateLabel from '$lib/zoom/rate-label.svelte'
	import StudentLabel from '$lib/student/student-label.svelte'
	import isToday from "dayjs/plugin/isToday.js";
	import {tooltip} from "$lib/action/tooltip.js";

	dayjs.extend(isToday)

	$: is_today = dayjs(zoom.start_date).isToday()
	$: is_ended = dayjs().isAfter(dayjs(zoom.start_date))

	const previewMaterial = async (d) => {
		open(PdfReaderDialog, {
			item_id: d.item_id
		}, {
			padding: 0,
			bg_class: 'transparent',
			width: '100%',
			closeButton: false
		})
	}

	const onTippy = node => {
		tippy(node, {
			content: 'Open zoom application'
		})
	}
</script>

<div class="p-2 flex w-full">
	<div class="w-24 flex-shrink-0">
		<p class="text-gray-500">{dayjs(zoom.start_date).format('h:mma')}</p>
	</div>
	<div class="w-full">
		<div class="italic text-sm mb-2">
			{#if zoom.is_big_classroom}
				<div class="flex items-center">
					<Icon name="classroom" className="text-purple-500 w-6 mr-2"/>
					<div class="text-purple-500">{zoom.sub_cat}</div>
				</div>
			{:else}
				<div class="text-blue-500 flex items-center">
					<div use:tooltip={'One on one'}><Icon name="one-on-one"/></div>
					<Dropdown caveat_visible activator_active_style="underline" activator_style="inline-block ml-2" placement="right">
						<a slot="activator" href="/students/{zoom.students[0].user_id}/tutor-group/{zoom.tutor_group_id}">
							{zoom.title.split('(')[0]}
						</a>
						<CoursePreviewPopup tutor_group_id={zoom.tutor_group_id}/>
					</Dropdown>
				</div>
			{/if}
		</div>
		{#each zoom.days as d}
			<div>
				<div class="inline-flex items-center cursor-pointer hover:text-yellow-700 mb-1">
					<p use:tooltip={'Preview material'} on:click={() => {previewMaterial(d)}} class="leading-tight mr-2">{d.title}</p>
					{#if !zoom.is_big_classroom && is_ended}
						<RateLabel rate={d.t_difficulty_rate}/>
					{/if}
				</div>
			</div>
		{/each}
		{#each zoom.students as s}
			<StudentLabel student={s}/>
		{/each}
	</div>
</div>
{#if is_today}
	<div class="ml-24 px-2 pb-2">
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