<script context="module">
	import {getStudentLessonList} from "../../../../api/tutor-api";
	export async function load({session, page, fetch}) {
		const user_id = page.query.get('user_id')
		if (!session) {
			this.redirect(302, '/login')
		} else {
			if (user_id) {
				let d = await getStudentLessonList(page.params.tutor_group_id, user_id, fetch)
				console.log('cliff: ', d)
			} else {
				// getTutorGroupLessonList(page.params.tutor_group_id, this.fetch)
				// getTutorGroupStudentList(page.params.tutor_group_id, this.fetch)
			}
		}
		return true
	}
</script>

yo