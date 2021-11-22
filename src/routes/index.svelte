<script context="module">
	import {http} from "$lib/http";
	import {groupByTime} from "$lib/zoom/group-by-time";

	export const load = async ({fetch}) => {
		const {success, data, debug} = await http.post(fetch, '/zoom/zoom_list_all', {})
		if (!success) {
			if (debug.err_code === 401) {
				return {
					status: 302,
					redirect: '/login'
				}
			} else {
				return {
					error: debug
				}
			}
		}
		return {
			props: {
				category_list: groupByTime(data)
			}
		}
	}
</script>

<script>
	import Preview from '$lib/zoom/zoom-preview.svelte'
	export let category_list
</script>

<div class="bg-gray-100">
	<div class="container">
		<div class="p-8 max-w-screen-xl">
			{#if category_list}
				{#each category_list as cat}
					<div class="mb-12">
						<h2 class="font-bold text-black mb-4">{cat.title}</h2>
						{#if cat.zoom_list.length}
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{#each cat.zoom_list as z}
									<Preview {z}/>
								{/each}
							</div>
						{:else}
							<div class="p-8 bg-white rounded">
								<p>No class</p>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="p-8">
					Loading...
				</div>
			{/if}
		</div>
	</div>
</div>

<svelte:head>
	<title>EHLA Zoom class</title>
</svelte:head>

