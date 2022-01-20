<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_fans_detail_overview', {
			student_id: page.params.student_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				detail: data
			},
			stuff: {
				overview: data
			}
		}
	}
</script>

<script>
	import {page, session} from '$app/stores'
	import {capitalize} from "$lib/helper/capitalize.js";

	export let detail // TODO gender/ nickname/ level/ courses []/ upcoming_zoom_list []/ completed_zoom_list []/ last_lesson_date
	$: student_id = $page.params.student_id
	$: tutor_group_id = $page.params.tutor_group_id
	console.log('detail',detail)
</script>

<div class="bg-banner p-4">
	<div class="max-w-screen-lg mx-auto">
		<div class="flex p-2 text-blue-500 text-sm">
			<a href="/students">Students</a>
			<span class="mx-2"> > </span>
			<a href="/students/{student_id}">{detail.nickname}</a>
		</div>

		<div class="flex my-8">
			<div class="w-72">
				<div class="mx-auto w-28 h-28 rounded-full border-2 border-gray-300 relative shadow bg-white">
					<img src="/student-{detail.gender}-icon.png" alt="gender" class="rounded-full">
					<div class="absolute -bottom-2 -right-4 ml-2 w-10 h-10 bg-blue-500 rounded-full cc text-white">{capitalize(detail.level)}</div>
				</div>
			</div>
			<div class="ml-4">
				<p style="font-size: 2em" class="font-light text-xl mb-4">{detail.nickname}</p>
				<div class="grid grid-cols-3 gap-4">
					<div>
						<div class="flex items-end">
							<p class="num">0</p>
							<p class="text-xs ml-1 mb-0.5 text-gray-500 leading-none">Upcoming <br/>lessons</p>
						</div>
					</div>
					<div>
						<div class="flex items-end">
							<p class="num">0</p>
							<p class="text-xs ml-1 mb-0.5 text-gray-500 leading-none">Completed <br/>lessons</p>
						</div>
					</div>
					<div class="leading-none mt-1.5">
						<p class="text-xs text-gray-500 leading-none mb-1">Last lessons</p>
						<p>2 weeks before</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="p-4 py-8 bg-gray-100">
	<slot/>
</div>

<style>
	.num {
		font-size: 2.5em;
		@apply leading-none font-light text-gray-500;
	}
	.bg-banner {
		background-image: url('/student-overiew-bg-1.png');
		background-size: 38%;
	}
</style>