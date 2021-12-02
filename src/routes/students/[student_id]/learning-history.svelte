<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/get_child_material_list', {
			child_id: page.params.student_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				learning_history: data
			}
		}
	}
</script>

<script>
	import {tutor_group_store} from "../../../store";
	import {page} from '$app/stores'
	import dayjs from "dayjs";

	export let learning_history
	const student_id = $page.params.student_id
	$: student = $tutor_group_store ? tutor_group_store.getOOO(student_id) : null
</script>

<p class="font-bold mb-4">Learning history</p>
{#each learning_history as item}
	<div class="p-4 border-gray-300 border">
		<p>{dayjs(item.start_date).format('DD MMM')}</p>
		<p>{item.title}</p>
		<p>{item.teacher_name}</p>
		<p>{item.t_difficulty_rate}</p>
	</div>
{/each}