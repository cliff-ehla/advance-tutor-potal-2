<script context="module">
	import dayjs from "dayjs";
	export function load () {
		return {
			status: 302,
			redirect: `/schedule/list-${dayjs().format('YYYY-MM-DD')}`
		}
	}
</script>