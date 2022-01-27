<script context="module">
	import {http, onFail} from "$lib/http";
	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.get(fetch, '/tutorApi/list_conversation')
		if (!success) return onFail(debug)
		return {
			stuff: {
				conversation_list: data
			},
			props: {
				conversation_list: data
			}
		}
	}
</script>

<script>
	export let conversation_list
	import {capitalize} from "$lib/helper/capitalize.js";
	import {page} from "$app/stores";
	$: tutor_group_id = $page.params.tutor_group_id
</script>

<div class="flex">
	<div class="flex-shrink-0 w-60 bg-gray-50 border-r border-gray-200 p-2 h-full overflow-scroll">
		<div class="h-12 flex items-center px-2">
			<p class="section-title">Conversation</p>
		</div>
		<div class="overflow-scroll" style="max-height: calc(100vh - 8em)">
			{#each conversation_list as c}
				<div class="mb-2">
					<a href="/conversation/{c.tutor_group_id}"
					   class="flex p-2 bg-white rounded border border-gray-100 transition transform hover:-translate-y-0.5 duration-100 focus:border-blue-500 focus:translate-y-0.5"
					   class:border-blue-300={c.tutor_group_id === tutor_group_id}
					   class:shadow={c.tutor_group_id === tutor_group_id}>
						<div class="w-8 h-8 rounded-full border border-gray-400 relative shadow flex-shrink-0">
							<img src="/student-{c.gender}-icon.png" alt="gender" class="rounded-full">
							<div class="absolute shadow font-bold border border-white -bottom-2 -right-2 ml-2 w-5 h-5 bg-blue-500 rounded-full text-xs cc text-white">{capitalize(c.level)}</div>
						</div>
						<div class="ml-4 -mt-0.5 leading-tight">
							<span class="text-sm text-gray-700 leading-none">{c.nickname}</span>
							<p class="text-gray-500 text-xs whitespace-nowrap overflow-ellipsis overflow-hidden w-40">{c.message}</p>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex-1">
		<slot/>
	</div>
</div>
