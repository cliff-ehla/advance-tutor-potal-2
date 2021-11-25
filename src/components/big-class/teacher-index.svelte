<script>
	import TeacherPreview from './teacher-preview.svelte'
	export let teachers = [
		{
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
		},
		{
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
	]
</script>

<div class="px-4 mx-auto max-w-screen-lg">
	{#each teachers as t}
		<div class="border-b border-gray-300 pb-4 mb-4">
			<TeacherPreview teacher={t}/>
			<p class="text-sm my-4">{t.detail_description}</p>
			<div class="flex items-center mt-4">
				<p class="flex-1">6 classes are opening</p>
				<button class="bg-blue-500 text-white px-2 py-1 rounded">Learn more</button>
			</div>
		</div>
	{/each}

</div>
