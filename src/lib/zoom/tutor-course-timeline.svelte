<script>
	import {http} from "$lib/http.js";

	export let existing_classroom
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import PdfReaderDialog from '$lib/pdf-reader/pdf-reader-dialog.svelte'
	import {getContext} from 'svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Icon from "$lib/ui/icon.svelte";
	import Dropdown from "$lib/ui/dropdown3.svelte";
	import Spinner from "$lib/ui/spinner.svelte";
	import StudentLabel from "$lib/student/student-label.svelte";

	const {openModal, closeModal} = getContext('simple-modal')
	dayjs.extend(utc)
	let obj = {}
	const isPast = (classroom) => {
		return dayjs.utc(classroom.start_date).local().isBefore(dayjs())
	}
	const onPreview = (item_id) => {
		openModal(PdfReaderDialog, {
			item_id
		}, {
			padding: 0,
			bg_class: 'transparent',
			width: '100%',
			closeButton: false
		})
	}
	const onHover = async (classroom) => {
		let zoom_id = classroom.zoom_id
		if (obj[zoom_id]) return
		const {data, success} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		if (success) {
			obj[zoom_id] = data.students
			obj = obj
		}
	}
</script>

{#each existing_classroom as classroom, i}
	<div class="flex relative pb-2">
		<div class="cc z-10 flex-shrink-0 w-4 h-4 border border-green-500 rounded-full {!isPast(classroom) ? 'bg-white' : 'bg-green-500'}"></div>
		{#if i < existing_classroom.length - 1}
			<div class="transform -translate-x-1/2 absolute w-0.5 bg-green-500 inset-y-0 ml-2 top-0 h-full"></div>
		{/if}
		<div class="ml-4 w-full">
			<p class="text-gray-500 text-sm">
				<span>{dayjs.utc(classroom.start_date).local().format('DD MMM (ddd), h:mma')}</span>
			</p>
			<div class="flex items-center">
				<div use:tooltip={'Preview'} on:click={() => {onPreview(classroom.item_id)}} class="cursor-pointer hover:text-blue-700 text-xs flex-1">
					{classroom.title}
				</div>
				<Dropdown activator_style="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-300 ml-1 block"
				          placement="right">
					<div class="w-4 h-4 cc" on:mouseenter={() => {onHover(classroom)}} slot="activator">
						<Icon name="avatar" className="w-3 text-gray-500"/>
					</div>
					<div class="bg-white p-4 shadow-lg border border-gray-300 rounded overflow-y-scroll" style="max-height: 400px">
						<p class="mb-2 text-gray-700">Students</p>
						{#if obj[classroom.zoom_id]}
							{#each obj[classroom.zoom_id] as student}
								<StudentLabel {student}/>
							{/each}
						{:else}
							<Spinner/>
						{/if}
					</div>
				</Dropdown>
			</div>
		</div>
	</div>
{/each}