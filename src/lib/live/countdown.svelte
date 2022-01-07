<script>
	import {onMount} from "svelte";
	import dayjs from "dayjs";
	export let start_date
	export let duration

	let test = 1234

	onMount(() => {
		diff()
	})

	const diff = () => {
		let test = dayjs().diff(dayjs(start_date), 'second')
		console.log('cliff: ', test)
	}
</script>

6:31
<slot test={test}/>