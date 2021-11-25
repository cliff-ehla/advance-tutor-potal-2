<script>
	import SelectionBox from '../ui-elements/selection-box.svelte'
	import TutorGroupSelectionBox from '../tutor-group/tutor-group-selection-box.svelte'
	import DatePicker from '../ui-elements/date-picker/date-picker.svelte'
	import Icon from '../ui-elements/icon.svelte'
	import {genStudentOptions, genTimeOptions, genRepeatOptions, reminder_options, duration_options, titleOptions} from "./gen-input-options";
	import dayjs from "dayjs";
	import {createZoom, editZoom, deleteZoom} from "../../api/zoom-api";
	import {getContext} from 'svelte'
	const {close} = getContext('simple-modal')
	const {showNotification} = getContext('notification')
	import utc from "dayjs/plugin/utc.js"
	import timezone from "dayjs/plugin/timezone.js"
	import customParseFormat from "dayjs/plugin/customParseFormat.js"
	import {tutor_group_store} from "../../store";

	dayjs.extend(utc)
	dayjs.extend(timezone)
	dayjs.extend(customParseFormat)
	const local_time_zone = dayjs.tz.guess()

	export let onCreateComplete = () => {}
	export let teacher_id
	export let teacher_nickname
	export let tutor_group_id // required when create zoom under tutor group
	export let zoom_config = undefined // for edit
	export let is_overview = false
	export let selected_type = 'One-on-one'

	let type_options = ['One-on-one', 'Group']

	$: is_edit = !!zoom_config

	let time_options = genTimeOptions()
	let repeat_options = genRepeatOptions()
	let student_options = genStudentOptions()
	let student_id = zoom_config ? zoom_config.students[0].user_id : undefined // TODO can only create zoom with one student
	$: selected_student = student_id ? student_options.find(s => s.value == student_id) : null
	$: student_tutor_group_options = selected_student ? selected_student.tutor_groups : []
	$: selected_tutor_group = $tutor_group_store.entity.tutor_group[tutor_group_id]

	// let tutor_group_id
	let repeat = 1
	let reminder = zoom_config ? zoom_config.reminder_value : 15
	let duration = zoom_config ? zoom_config.duration : 40
	let title = zoom_config ? zoom_config.title : ''

	// required format for Datepicker, Timepicker component
	let start_date_hk_native = (zoom_config && zoom_config.start_date) ? dayjs.utc(zoom_config.start_date).tz('Asia/Hong_Kong').toDate() : dayjs(new Date()).add(1, 'day').toDate()
	let start_time_hk_string = (zoom_config && zoom_config.start_date) ? dayjs.utc(zoom_config.start_date).tz('Asia/Hong_Kong').format('HH:mm:ss') : '13:00:00'

	// computing the selected date & time into a HKT time string (YYYY-MM-DD HH:ss:ss)
	$: computed_start_date_hk_string = dayjs(start_date_hk_native).format('YYYY-MM-DD') + ' ' + start_time_hk_string

	// convert the HKT string to UTC string for backend
	$: computed_start_date_utc_string = dayjs.tz(computed_start_date_hk_string, "YYYY-MM-DD HH:mm:ss", "Asia/Hong_Kong").utc().format('YYYY-MM-DD HH:mm:ss')

	// display in user local time
	$: computed_start_date_local_string = dayjs.utc(computed_start_date_utc_string).tz(local_time_zone).format('DD MMM, h:mm A')

	let loading = false

	const onCreateZoom = async () => {
		if (loading) return
		if (!tutor_group_id) return console.log('tutor group id is undefined')
		loading = true
		let params = {
			teacher_id,
			teacher_nickname,
			start_date: computed_start_date_utc_string,
			reminder_value: reminder,
			repeated_cnt: repeat,
			duration,
			title: selected_tutor_group.title
		}
		if (is_edit) {
			params.wrapper_id = zoom_config.wrapper_id
			delete params.repeated_cnt
		}
		params.tutor_group_id = tutor_group_id
		if (is_edit) {
			await editZoom(params)
			showNotification(`${selected_tutor_group.title} updated`)
		} else {
			await createZoom(params)
			showNotification(`${selected_tutor_group.title} is created`)
			onCreateComplete()
		}
		close()
	}

	const onDeleteZoom = async () => {
		await deleteZoom(zoom_config.wrapper_id)
		close()
		onCreateComplete()
		showNotification(`${title} is deleted`)
	}
</script>

<div>
<!--	<div class="flex mb-4">-->
<!--		<div class="w-8 flex-shrink-0"></div>-->
<!--		<div class="ml-2 px-2 w-full">-->
<!--			<div class="text-xs mt-4 leading-none text-gray-400">Lesson title</div>-->
<!--			<TextWithOptions placeholder="Add lesson title" on:input={e => {title = e.detail}} value={title} options={titleOptions}/>-->
<!--			{#if title_required}<p class="text-xs text-red-500">Title is required</p>{/if}-->
<!--		</div>-->
<!--	</div>-->
	<div class="text-t1 ml-12 mt-2 mb-4 font-bold">{is_edit ? 'Edit' : 'Create'} Zoom Lesson</div>
	{#if is_overview}
	<div class="mt-4 mb-6 ml-12 flex">
		{#each type_options as option}
			<button on:click={() => {selected_type = option}}
			        disabled={is_edit}
			        class="{option === selected_type ? 'text-blue-500 bg-blue-200' : !is_edit ? 'text-gray-500 hover:bg-gray-200' : 'cursor-not-allowed'}
		        focus:outline-none px-2 rounded h-10 flex items-center mr-2">{option}</button>
		{/each}
	</div>
	<div class="flex mb-4">
		<div class="w-8 flex-shrink-0">
			<Icon name={selected_type === 'One-on-one' ? 'avatar' : 'user-group'} />
		</div>
		<div class="ml-2">
			{#if selected_type === 'One-on-one'}
				<div class="mb-2">
					<div class="text-xs ml-2 leading-none text-gray-400 mb-1">Student</div>
					<SelectionBox
									disabled={is_edit}
									dropdown_class="w-72"
									placeholder="Select a student"
									on:input={e => student_id = e.detail} options={student_options} selected_value={student_id}/>
				</div>
				<div>
					<div class="text-xs ml-2 leading-none text-gray-400">Course</div>
					<SelectionBox
									disabled={!selected_student || is_edit}
									dropdown_class="w-72"
									placeholder="{!selected_student ? '--' : 'Select a tutor group'}"
									value_key="tutor_group_id"
									label_key="title"
									on:input={e => tutor_group_id = e.detail} options={student_tutor_group_options} selected_value={tutor_group_id}/>
				</div>
			{:else if selected_type === 'Group'}
				<div class="mb-2">
					<div class="text-xs ml-2 leading-none text-gray-400 mb-1">Course</div>
					<TutorGroupSelectionBox disabled={is_edit} on:input={e => tutor_group_id = e.detail} selected_value={tutor_group_id}/>
				</div>
			{/if}
		</div>
	</div>
	<div class="h-0.5 bg-gray-200 my-4"></div>
	{/if}
	<div class="flex mb-4">
		<div class="w-8 flex-shrink-0 mt-1">
			<Icon name="stopwatch" />
		</div>
		<div class="ml-2 w-full">
			<div class="flex items-center">
				<div>
					<div class="text-xs ml-2 leading-none text-gray-400">Hong Kong</div>
					<div class="flex items-center">
						<DatePicker
										on:datechange={e => start_date_hk_native = e.detail}
										selected={start_date_hk_native}
										isAllowed={date => {
    const millisecs = date.getTime();
    if (millisecs + 25 * 3600 * 1000 < Date.now()) return false;
    return true;
  }} />

						<SelectionBox on:input={e => {start_time_hk_string = e.detail}} options={time_options} selected_value={start_time_hk_string} caveat_visible={false}/>
					</div>
				</div>
				<div class="text-xs p-2 bg-gray-200 rounded ml-auto">
					<p class="flex-1">{local_time_zone.split('/')[1]}</p>
					<div>{computed_start_date_local_string}</div>
				</div>
			</div>
			<div class="mt-2">
				<div class="text-xs ml-2 leading-none text-gray-400">Duration</div>
				<SelectionBox on:input={(e) => {duration = e.detail}} options={duration_options} selected_value={duration}/>
			</div>
		</div>
	</div>
	{#if !is_edit}
	<div class="h-0.5 bg-gray-200 my-4"></div>
	<div class="flex items-center">
		<div class="w-8 flex-shrink-0">
			<svg x="0px" y="0px" viewBox="0 0 36 36" class="w-6"><path d="M31.694 17.364c.03.24.05.48.05.728 0 3.427-2.786 6.216-6.213 6.216H8.753v-5.615L0 25.768l8.752 7.07v-5.243h16.78c5.24 0 9.503-4.26 9.503-9.503 0-1.057-.178-2.102-.53-3.106l-2.81 2.378z"></path><path d="M4.302 18.637c-.03-.238-.046-.483-.046-.728 0-3.425 2.787-6.216 6.214-6.216h16.78v5.614L36 10.234l-8.75-7.072v5.243H10.47C5.23 8.405.965 12.67.965 17.91c0 1.056.177 2.098.53 3.108l2.807-2.38z"></path></svg>
		</div>
		<div class="ml-2">
			<div class="text-xs ml-2 leading-none text-gray-400">Number of recurrent lessons</div>
			<SelectionBox on:input={(e) => {repeat = e.detail}} options={repeat_options} selected_value={repeat} placeholder="Doesn't repeat"/>
		</div>
	</div>
	{/if}
	<div class="h-0.5 bg-gray-200 my-4"></div>
	<div class="flex items-center">
		<div class="w-8 flex-shrink-0">
			<Icon name="bell"/>
		</div>
		<div class="ml-2">
			<div class="text-xs ml-2 leading-none text-gray-400">Reminder</div>
			<SelectionBox on:input={e => reminder = e.detail} options={reminder_options} selected_value={reminder}/>
		</div>
	</div>
	<div class="flex mt-4">
		{#if is_edit}
			<button on:click={onDeleteZoom} class="py-2 px-4 {loading ? 'bg-gray-200' : 'border-red-500 bg-white border text-red-500'} cursor-pointer rounded">
				{loading ? 'Saving...' : 'Delete'}
			</button>
		{/if}
		<div class="flex-1"></div>
		<button on:click={onCreateZoom} class="py-2 px-4 {loading ? 'bg-gray-200' : 'bg-blue-500 text-white'} cursor-pointer rounded">
			{loading ? 'Saving...' : is_edit ? 'Edit' : 'Create'}
		</button>
	</div>
</div>
