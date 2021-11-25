<script>
	import dayjs from "dayjs";
	const list = [
		{
			title: 'Miss Vivian',
			description: 'Extensive experience in production and publishing with Oxford University Press, Principal Lecturer and Director of International Affairs in Oxford Brookes University, Fellow of Harris Manchester College in the University of Oxford, Chief Editor and Senior Consultant of EHLA',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g1-1515755276212.jpg',
			videos: [
					'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
					'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
			],
			lessons: [
				{
					title: 'Grammar',
					start_date: '2021-12-10 15:00:00',
					end_date: '2021-12-10 16:00:00',
				},
				{
					title: 'Grammar',
					start_date: '2021-12-10 15:00:00',
					end_date: '2021-12-10 16:00:00',
				}
			]
		},
		{
			title: 'Danielle Knowles',
			description: 'Extensive experience in production and publishing with Oxford University Press, Principal Lecturer and Director of International Affairs in Oxford Brookes University, Fellow of Harris Manchester College in the University of Oxford, Chief Editor and Senior Consultant of EHLA',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
			videos: [
				'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
			],
			lessons: [
				{
					title: 'Grammar',
					start_date: '2021-12-10 15:00:00',
					end_date: '2021-12-10 16:00:00',
				},
				{
					title: 'Grammar',
					start_date: '2021-12-10 15:00:00',
					end_date: '2021-12-10 16:00:00',
				}
			]
		}
	]
</script>

<div class="p-4 bg-gray-100">
	{#each list as t}
		<div class="lg-flex items-center p-4">
			<div class="w-40 h-40 rounded-full bg-cover bg-center mx-auto" style="background-image: url({t.thumbnail_path})"></div>
			<div class="mt-2 mb-4 lg:ml-4">
				<div class="text-lg font-bold">{t.title}</div>
				<div>{t.description}</div>
			</div>
			<p class="font-bold mb-2">Video</p>
			{#each t.videos as v}
				<video class="bg-black" src={v}></video>
			{/each}
		</div>
		<div class="">
			{#each t.lessons as t}
				<div class="p-4 bg-white mb-2">
					<div class="font-bold mb-2">{t.title}</div>
					<div class="flex">
						<div>{dayjs(t.start_date).format('DD MMM YYYY')}</div>
						<div class="ml-2">{dayjs(t.start_date).format('h:mma')}-{dayjs(t.end_date).format('h:mma')}</div>
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>