<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id: page.params.tutor_course_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				course_detail: data
			}
		}
	}
</script>

<script>
	import PdfReaderDialog from "$lib/pdf-reader/pdf-reader-dialog.svelte";
	export let course_detail
	import TutorCourseTimeline from '$lib/zoom/tutor-course-timeline.svelte'
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import {capitalize} from "$lib/helper/capitalize.js";
	import {rc_level_to_label} from "$lib/store/rc-level-to-label.js";

	$: existing_classroom = course_detail.existing_classroom
	$: material_status = course_detail.material_status
	$: first_classroom = existing_classroom && existing_classroom[0]

	const previewMaterial = async (item_id) => {
		openModal(PdfReaderDialog, {
			item_id
		}, {
			padding: 0,
			bg_class: 'transparent',
			width: '100%',
			closeButton: false
		})
	}
</script>

<div class="bg-banner p-4 -mt-12 pt-12">
	<div class="container mx-auto">
		<div class="my-8">
			<p class="text-sm bg-purple-400 border border-purple-400 rounded-sm font-bold text-white px-2 py-0.5 leading-tight inline-block">
				#{first_classroom.description_code_short_id || 'NA'}
			</p>
			<p class="text-sm bg-purple-50 border border-purple-200 rounded-sm text-purple-500 px-2 py-0.5 leading-tight inline-block">
				{rc_level_to_label[first_classroom.rc_level] || first_classroom.rc_level}
			</p>
			<p class="text-purple-800 leading-tight mt-1">{first_classroom.sub_cat || 'NA'}</p>
			<h1 class="page-title mb-4">{course_detail.title}</h1>
			<p class="text-gray-600 my-4 max-w-screen-md leading-loose">{@html first_classroom.description || 'Course desc - NA'}</p>
		</div>
	</div>
</div>

<div class="bg-gray-100">
	<div class="container py-4 mx-auto">
		<div class="flex my-4">
			<div style="width: 240px" class="flex-shrink-0">
				<div class="section-box sticky top-20 z-50">
					<p class="section-title mb-4">Class history</p>
					<TutorCourseTimeline {existing_classroom}/>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-xl mb-4 text-gray-700">Course materials</p>
				<div class="grid grid-cols-3 gap-4">
					{#each material_status as m}
						<div on:click={() => {previewMaterial(m.item_id)}}
						     class="hover:-translate-y-1 hover:shadow-lg hover:border-blue-500 transition transform bg-white rounded-lg border border-gray-300 cursor-pointer">
							<div class="h-40 overflow-hidden rounded-lg">
								<img class="rounded" src={m.thumbnail_path} alt={m.title}/>
							</div>
							<p class="p-2 leading-tight text-sm">{m.name}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.bg-banner {
		background-image: url('/student-overiew-bg-1.png');
		background-size: 38%;
	}
</style>