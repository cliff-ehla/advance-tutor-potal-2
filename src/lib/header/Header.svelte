<script>
	export let user_info
</script>

<header class="flex justify-between h-16 items-center px-4">
	<a href="/">
		<img src="/logo.png" alt="ehla" class="w-12 rounded"/>
	</a>
	<div>
		{#if user_info}
			<a href="/profile" class="text-sm">{user_info.nickname}</a>
		{:else}
			<a href="/login">Login</a>
		{/if}
	</div>
</header>