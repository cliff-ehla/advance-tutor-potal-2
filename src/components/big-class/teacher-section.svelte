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

	import TeacherPreview from './teacher-preview.svelte'
</script>

<div>
	<TeacherPreview {teacher}/>
	<div class="bg-white mt-4">
		<div class="grid sm:grid-cols-2 grid-cols-1 gap-4">
			<div>
				<p class="font-bold mb-2">Introduction</p>
				<div class="bg-black w-full rounded" style="padding-top: 52%">
				</div>
			</div>
			<div>
				<p class="font-bold mb-2">Lesson demo</p>
				<div class="bg-black w-full rounded" style="padding-top: 52%">
				</div>
			</div>
		</div>

	</div>
	<div class="bg-white mt-4">
		<p class="font-bold mb-2">About {teacher.name}</p>
		<p class="text-gray-500">{teacher.detail_description}</p>
	</div>
</div>
