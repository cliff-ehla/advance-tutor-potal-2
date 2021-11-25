<script>
	import dayjs from "dayjs";
	import TeacherSection from './teacher-section.svelte'

	export let lesson = {
		thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/cms/audios/202003/18/living4500_1584516980401.png',
		category: 'Reading comprehension (Exam)',
		title: 'Back to Earth with a BUMP - Part 1',
		level: 'KS1 / P1-P3',
		teacher: 'Amanda Lay',
		type: 'big class',
		start_time: '2021-12-91 19:30:00'
	}
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
</script>

<div class="bg-gray-100 pt-8">
	<div class="h-96 bg-center mx-auto bg-cover bg-center rounded-lg" style="background-image: url({lesson.thumbnail_path}); max-width: 720px"></div>
	<div class="bg-blue-500 text-white h-12 flex items-center rounded-t-2xl -mt-4 md:mt-4">
		<div class="max-w-screen-lg mx-auto w-full px-4">
			{dayjs(lesson.start_time).format('DD MMM YYYY HH:mma')}
		</div>
	</div>
</div>
<div class="bg-white max-w-screen-lg mx-auto p-4">
	<p class="text-blue-500">{lesson.category}</p>
	<p class="font-bold md:text-xl">{lesson.title}</p>
	<p class="text-gray-500 text-sm mt-2">Recommended level: {lesson.level}</p>
	<p class="text-gray-500 text-sm">Teacher: {lesson.teacher}</p>

	<div class="bg-blue-500 text-white px-2 py-1 leading-none inline-block rounded-full text-sm">Big class</div>

	<p class="mt-4 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus debitis magni repellat velit? Architecto beatae consequuntur dicta ex, facere minima molestias quam quia quo ratione. Aliquid aperiam asperiores delectus dolore exercitationem mollitia, quisquam quod rem sunt temporibus. A ab commodi cupiditate dolor, doloremque enim et expedita inventore ipsa, ipsum laborum minima nisi placeat praesentium quas vel voluptas! Aperiam cumque deleniti eius enim fuga illum maiores obcaecati odio placeat sapiente, sit ut vitae voluptatem! Alias corporis delectus dolorum facilis, id ipsum magni modi nisi nobis provident quibusdam quis sint temporibus totam ut vitae voluptatem voluptatum. Laborum, quaerat sit. Et necessitatibus, voluptatum.</p>
</div>

<div class="bg-white p-4 border-t border-gray-200">
	<div class="max-w-screen-lg mx-auto">
		<TeacherSection {teacher}/>
	</div>
</div>


