<script context="module">
	import dayjs from "dayjs";
	export function load () {
		return {
			status: 302,
			redirect: `/schedule/${dayjs().format('YYYY-MM-DD')}/list`
		}
	}
</script>