<script>
	export let teacher = {
		thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		name: 'Amanda Lay',
		description: '5 Year teaching experience | TEFL English teacher',
		video_1: '',
		video_2: '',
		detail_description: 'Ms. Jodie was born and educated in the UK. She holds a First Class Honours Bachelor\'s Degree in Film and Moving Image Production from Leeds Metropolitan University, U.K.. \n' +
				'\n' +
				'Jodie is an English teacher with more than 5 years of teaching experience and a certified TEFL teacher. She possesses vast experience of teaching both children and adults on a big or small group setting and individually. She also has significant experience in teaching drama. \n' +
				'\n' +
				'Teacher Jodie is a creative and passionate English and Drama teacher with strong communication skills. She looks forward to starting a fun and engaging English journey with your child.\n'
	}

	let lessons = [
		{
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/cms/audios/202003/18/living4500_1584516980401.png',
			category: 'Reading comprehension (Exam)',
			title: 'Back to Earth with a BUMP - Part 1',
			level: 'KS1 / P1-P3',
			teacher: 'Amanda Lay',
			type: 'big class',
			start_time: '2021-12-91 19:30:00'
		},
		{
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/cms/audios/202003/18/living4500_1584516980401.png',
			category: 'Reading comprehension (Exam)',
			title: 'Back to Earth with a BUMP - Part 1',
			level: 'KS1 / P1-P3',
			teacher: 'Amanda Lay',
			type: 'big class',
			start_time: '2021-12-91 19:30:00'
		}
	]

	import TeacherSection from './teacher-section.svelte'
	import LessonPreview from './lesson-preview.svelte'
</script>

<div class="max-w-screen-lg mx-auto">
	<div class="p-4">
		<TeacherSection {teacher}/>
	</div>

	<div class="bg-gray-100 mt-4 p-4">
		<h2 class="mb-4 font-bold">Classes are now opening in this month</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each lessons as lesson}
				<div class="mb-2 bg-white rounded">
					<LessonPreview item={lesson}></LessonPreview>
				</div>
			{/each}
		</div>
	</div>

</div>
