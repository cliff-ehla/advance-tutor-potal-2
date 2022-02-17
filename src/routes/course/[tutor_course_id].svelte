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
	export let course_detail
	import TutorCourseTimeline from '$lib/zoom/tutor-course-timeline.svelte'

	$: existing_classroom = course_detail.existing_classroom
	$: material_status = course_detail.material_status
</script>

<div class="bg-banner p-4 -mt-12 pt-12">
	<div class="container mx-auto">
		<div class="my-8">
			<h1 class="page-title mb-4">{course_detail.title}</h1>
			<p class="text-gray-600 my-4 max-w-screen-sm">In this Zoom class, native speaker teachers will guide and train students to improve and enhance their English speaking proficiency, and to better prepare for answering the interview questions. It provides a very good opportunity and English environment for students to conduct daily conversations in English and  group interview practice. The teacher will guide students to improve through the training process.</p>
		</div>
	</div>
</div>

<div class="bg-gray-100">
	<div class="container py-4 mx-auto">
		<div class="flex my-4">
			<div style="width: 240px" class="flex-shrink-0">
				<div class="section-box sticky top-20">
					<p class="section-title mb-4">Class history</p>
					<TutorCourseTimeline {existing_classroom}/>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-xl mb-4 text-gray-700">Course materials</p>
				<div class="grid grid-cols-3 gap-4">
					{#each material_status as m}
						<div class="relative bg-white rounded-lg shadow-lg border border-gray-300">
							<div class="h-40 overflow-hidden rounded">
								<img class="shadow border border-gray-300 rounded" src={m.thumbnail_path} alt={m.title}/>
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