<script>
	export let item

	$: article = item.article
</script>

<div class="p-8">
	{article}
</div>