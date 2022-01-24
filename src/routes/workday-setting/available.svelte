<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_available_timeslot', {
			tutor_group_id: page.params.tutor_group_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				data: data
			}
		}
	}
</script>

<script>
	import TimeTableList from '$lib/available-time-table/available-time-table-list.svelte'
	export let data
</script>

<TimeTableList time_slot_list={data}/>