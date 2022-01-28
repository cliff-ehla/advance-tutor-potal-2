<script context="module">
	import {http, onFail} from "$lib/http";
	import {noticeCenterStore} from "$lib/store/notice-center-store.js";

	export const load = async ({page, fetch}) => {
		const {success, debug} = await noticeCenterStore.fetchNoticeAndMessage(fetch)
		if (!success) return onFail(debug)
		return true
	}
</script>

<script>
	import IncomeMessagePreview from '$lib/notice-center/income-message-preview.svelte'
	import IncomeNotePreview from '$lib/notice-center/income-note-preview.svelte'
</script>

<div class="bg-gray-50">
	<div class="container py-4">
		<h1 class="page-title mb-4">Notifications</h1>
		<div class="max-w-screen-sm section-box">
			{#if $noticeCenterStore.master_list.length}
				{#each $noticeCenterStore.master_list.slice(0,6) as m}
					{#if m.tutor_group_id}
						<IncomeMessagePreview truncate={false} message={m}/>
					{:else}
						<IncomeNotePreview truncate={false} message={m}/>
					{/if}
				{/each}
			{:else}
				<div class="p-4">
					<img src="notification-empty-2.png" alt="inbox-empty" class="w-72 mx-auto"/>
					<p class="text-xl text-gray-300 text-center">You inbox is empty</p>
				</div>
			{/if}
		</div>
	</div>
</div>