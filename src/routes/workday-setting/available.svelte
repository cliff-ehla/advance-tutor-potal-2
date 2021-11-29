<script>
	import {onMount} from 'svelte'
	import {fetchTutorAvailableTimeSlot} from "../../api/tutor-api";
	import TopBar from '../../components/top-bar.svelte'
	import TimeTableList from '../../components/calendar/available-time-table-list.svelte'

	let data

	onMount(async () => {
		data = await fetchTutorAvailableTimeSlot(fetch)
	})
</script>

<TopBar/>

{#if data}
	<TimeTableList time_slot_list={data}/>
{/if}