<script>
	export let user_info
</script>

<header class="flex h-16 items-center px-4">
	<a class="flex items-center" href="/">
		<img src="/logo.png" alt="ehla" class="w-12 rounded"/>
		<p class="ml-4 font-bold">EHLA Zoom class</p>
	</a>
	<div class="ml-auto hover:text-blue-500">
		{#if user_info}
			<a href="/profile" class="text-sm">{user_info.nickname}</a>
		{:else}
			<a href="/login">Login</a>
		{/if}
	</div>
</header>