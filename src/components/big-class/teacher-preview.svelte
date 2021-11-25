<script>
	export let teacher = {
		thumbnail_path: 'https://ehla-media-bucket.s3.amazonaws.com/thumbnail_20180101/g2-1515755301446.jpg',
		name: 'Amanda Lay',
		description: '5 Year teaching experience | TEFL English teacher'
	}
</script>

<div class="flex items-center">
	<div class="w-20 h-20 rounded-full bg-cover bg-center" style="background-image: url({teacher.thumbnail_path})"></div>
	<div class="ml-2">
		<p class="font-bold">{teacher.name}</p>
		<p class="text-gray-500">{teacher.description}</p>
	</div>
</div>
