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
	import TutorCoursePreviewPopup from '$lib/zoom/tutor-course-preview-popup.svelte'
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import StudentLabel from '$lib/student/student-label.svelte'
	import {capitalize} from "$lib/helper/capitalize.js";
	import {zoom_store} from '$lib/store/zoom.js'
	import {user_info} from "$lib/store/user_info.js";
	import {student_store} from "$lib/store/student.js";
	import {onMount} from "svelte";
	import {is_loading} from "$lib/store/is_loading.js";
	import StudentNoteReadOnly from '$lib/student/student-note-readonly.svelte'

	$: is_today = dayjs(zoom.start_date).isToday()
	$: is_ended = dayjs().isAfter(dayjs(zoom.end_date))
	$: student = zoom.students.length ? zoom.students[0] : undefined
	$: student_id = zoom.students.length ? zoom.students[0].user_id : undefined
	$: student_gender = zoom.students.length ? zoom.students[0].gender : undefined
	$: is_classroom = zoom.is_big_classroom
	$: duration = zoom.duration || dayjs(zoom.end_date).diff(dayjs(zoom.start_date), 'minute')
	$: student_note_list = $student_store[student_id]
	$: student_note_count = student_note_list && student_note_list.length
	$: student_note = student_note_list && student_note_list[0]
	const default_max_student_display = 5
	let max_student_display = default_max_student_display
	let alert_on

	onMount(async () => {
		const {data, success, metadata} = await student_store.fetchStudentNote(fetch, {student_id})
		alert_on = metadata.alert_on
	})

	const previewMaterial = async (d) => {
		open(PdfReaderDialog, {
			item_id: d.item_id,
			start_date: zoom.start_date,
			end_date: zoom.end_date,
		}, {
			padding: 0,
			bg_class: 'transparent',
			width: '100%',
			closeButton: false
		})
	}
</script>

<div class="p-8 border border-gray-300 w-full bg-white shadow-lg rounded overflow-y-auto" style="max-width: 400px; max-height: 600px">
	<div class="w-full">
		<div class="text-blue-500 text-lg">
			<div class="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white border border-gray-200 shadow">
				{#if is_classroom}
					<Icon name="classroom" className="w-8 text-purple-500 absolute top-4 right-4"/>
				{:else}
					<Icon name="one-on-one" className="w-8 text-blue-500 absolute top-4 right-4"/>
				{/if}
			</div>
			{#if is_classroom}
				<p class="text-sm bg-purple-400 rounded-sm font-bold text-white px-2 py-0.5 leading-tight inline-block">{capitalize(zoom.rc_level)}</p>
				<Dropdown activator_style="inline-block" placement="right" caveat_visible>
					<a href="/course/{zoom.tutor_course_id}" slot="activator" class="text-purple-500 hover:text-purple-700 leading-tight mt-1">{zoom.sub_cat || zoom.sub_cat_en}</a>
					<TutorCoursePreviewPopup tutor_course_id={zoom.tutor_course_id}/>
				</Dropdown>
			{:else}
				<div class="text-gray-700 leading-tight mb-1">
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
		{#if !is_classroom}
			<div class="flex items-center">
				<a href="/students/{student_id}" class="group flex items-center hover:bg-purple-50">
					<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full border border-gray-400 w-5">
					<p class="text text-purple-500 ml-1 group-hover:text-purple-700">{student.nickname}</p>
					<div style="font-size: 10px" class="bg-purple-400 text-white px-2 rounded-sm ml-1 text-xs font-bold">{capitalize(student.level)}</div>
				</a>
				<a href="/conversation/{zoom.tutor_group_id}" class="icon-button ml-1">
					<Icon name="chat" className="w-4"/>
				</a>
			</div>
			<a href="/students/{student_id}/notes" class="hover:bg-purple-100 block mt-1 text-xs text-gray-500 pl-2 border-l-4 border-purple-400 bg-purple-50 py-0.5 leading-tight">
				{#if student_note}
					<Dropdown activator_style="inline-block relative" activator_active_style="bg-transparent">
						<div slot="activator">
							{#if alert_on}
								<div class="absolute border-pink-500 shadow border-2 bg-pink-400 w-4 h-4 rounded-full -right-2 -top-2.5"></div>
							{/if}
							{student_note.note}
							{#if student_note_count > 1}
								<span style="font-size: 9px" class="ml-1 px-1 bg-purple-400 text-white rounded font-bold">{student_note_count - 1}+</span>
							{/if}
						</div>
						<div class="bg-white p-4 shadow-lg border-2 border-purple-400 rounded">
							<StudentNoteReadOnly readonly {student_id}/>
						</div>
					</Dropdown>
				{:else}
					{#if $is_loading}
						<p>Loading...</p>
					{:else}
						<p class="opacity-60">No notes for the student</p>
					{/if}
				{/if}
			</a>
		{/if}
		<div style="min-width: 280px" class="grid grid-cols-2 bg-gray-50 leading-none border border-gray-200 mt-4">
			<div class="text-center p-1 relative">
				<img src={$user_info.profile_pic} alt="profile pic" class="border border-gray-400 rounded-full w-5 h-5 absolute left-1 top-1">
				<p class="tz mb-0.5">{$zoom_store.time_zone_options[0].label}</p>
				<p class="text-gray-500 text-xl">{dayjs.utc(zoom.start_date_utc || zoom.start_date).tz($zoom_store.time_zone_options[0].tz).format('h:mma')}</p>
				<p class="text-xs text-gray-500 -mt-1">{dayjs.utc(zoom.start_date_utc || zoom.start_date).local().format('DD MMM')}</p>
			</div>
			<div class="border-l border-gray-300 text-center p-1 relative">
				<div style="font-size: 10px" class="absolute w-12 -ml-6 py-0.5 rounded-t-lg bg-gray-400 text-white left-0 bottom-0">{duration} min</div>
				<Icon name="timezone" className="absolute -left-3 top-1/2 -mt-3 w-6 text-gray-400"/>
				{#if is_classroom}
					<Icon name="classroom" className="text-purple-900 w-5 absolute right-1 top-1"/>
				{:else}
					<img src="/student-{student_gender}-icon.png" alt="profile pic" class="border border-gray-500 rounded-full w-5 h-5 absolute right-1 top-1">
				{/if}
				<p class="tz mb-0.5">{$zoom_store.time_zone_options[1].label}</p>
				<p class="text-gray-500 text-xl">{dayjs.utc(zoom.start_date_utc || zoom.start_date).tz($zoom_store.time_zone_options[1].tz).format('h:mma')}</p>
				<p class="text-gray-500 text-xs -mt-1">{dayjs.utc(zoom.start_date_utc || zoom.start_date).tz($zoom_store.time_zone_options[1].tz).format('DD MMM')}</p>
			</div>
		</div>
		<div class="mt-4">
			{#if zoom.days.length}
				{#each zoom.days as d}
					<div class="relative">
						<div use:tooltip={'Preview material'} on:click={() => {previewMaterial(d)}}
						     class="flex items-center cursor-pointer bg-gray-50 hover:text-blue-500 hover:bg-white transition-colors my-2 px-4 py-3 shadow rounded border-gray-300 border">
							<Icon name="pdf" className="text-gray-500 w-6 flex-shrink-0"/>
							<p class="leading-tight ml-2">{d.title}</p>
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
		{#if is_classroom}
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
		{/if}
	</div>
	{#if is_today}
		<div class="mt-4">
			<div class="flex items-center">
				<a href="/zoom/{zoom.wrapper_id}" class="bg-gradient-to-b from-green-500 to-green-700 hover:shadow transition-transform transform hover:-translate-y-0.5 text-white py-1.5 rounded-full flex-1 flex items-center justify-center">
					Start class
				</a>
				<a use:tooltip={'Open zoom application'} href={zoom.zoom_link} class="bg-white border-2 border-blue-500 text-blue-500 rounded-full cc ml-2 w-12 h-12">
					<Icon name="zoom" className="w-8"/>
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.tz {
		@apply bg-gray-100 border border-gray-300 px-1 inline-block;
		font-size: 9px;
	}
</style>