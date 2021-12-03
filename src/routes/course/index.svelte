<script>
	import {tutor_group_store} from "../../store";
	import {slugToText} from "../../utils/slug-to-text";
	import dayjs from "dayjs";
	$: courses = getTutorGroup($tutor_group_store.o_o_o_list)

	const getTutorGroup = (list) => {
		const results = []
		list.forEach(item => {
			item.tutor_groups.forEach(tg => {
				const expired = dayjs(tg.end_date).isBefore(dayjs())
				if (!expired) {
					results.push({
						...tg,
						...{
							student_name: item.nickname,
							student_id: item.user_id
						}
					})
				}
			})
		})
		return results
	}
</script>

<div class="p-6">
	<div class="max-w-screen-lg">
		{#each courses as course}
			<div class="p-4 border border-gray-200">
				<a class="hover:text-red-500" href="/tutor-group/{course.tutor_group_id}">{course.title}</a>
				<p>{dayjs(course.start_date).format('DD MMM')} - {dayjs(course.end_date).format('DD MMM')}</p>
				<p>{course.completion_cnt} / {course.total_lesson_cnt}</p>
				<p>{course.unread_message_cnt}</p>
			</div>
		{/each}
	</div>
</div>