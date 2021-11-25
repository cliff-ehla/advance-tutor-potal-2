<script>
	import LessonPreview from './lesson-preview.svelte'

	let nav_items = [
		{
			label: 'Small-group Class',
			href: ''
		},
		{
			label: 'Big Class',
			href: ''
		},
		{
			label: '1-on-1 Class',
			href: ''
		}
	]

	let teachers = [
		{
			name: 'Jodie Symonds',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		},
		{
			name: 'Jodie Symonds',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		},
		{
			name: 'Jodie Symonds',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		},
		{
			name: 'Jodie Symonds',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		},
		{
			name: 'Jodie Symonds',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		},
		{
			name: 'Jodie Symonds',
			thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		}
	]

	let tabs = [
		{
			label: 'All'
		},
		{
			label: 'Storytelling'
		},
		{
			label: 'Creative writing'
		},
		{
			label: 'Spealing'
		}
	]

	let items = [
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
		},
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
</script>

<h1 class="p-4 font-bold text-lg">Online classes at EHLA</h1>
<div class="flex">
	{#each nav_items as item}
		<p class="p-2 px-4">{item.label}</p>
	{/each}
</div>
<div class="flex p-4">
	{#each teachers as t}
		<div class="w-28">
			<div class="w-20 h-20 mx-auto rounded-full bg-cover bg-center" style="background-image: url({t.thumbnail_path})"></div>
			<div class="mt-2 text-sm text-center">{t.name}</div>
		</div>
	{/each}
</div>
<div class="flex p-4">
	{#each tabs as t}
		<div class="rounded border border-gray-300 px-4 py-1 mr-2">{t.label}</div>
	{/each}
</div>

<div class="mt-4 p-4 bg-gray-100">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each items as i}
			<div class="bg-white">
				<LessonPreview item={i}/>
			</div>
		{/each}
	</div>
</div>