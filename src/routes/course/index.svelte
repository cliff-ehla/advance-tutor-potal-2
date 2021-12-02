<script>
	import {tutor_group_store} from "../../store";
	import {slugToText} from "../../utils/slug-to-text";
</script>

<div class="p-6">
	<div class="max-w-screen-lg">
		{#if $tutor_group_store.o_o_o_list.length === 0}
			<div class="p-16">
				You have no students
			</div>
		{:else}
			{#each $tutor_group_store.o_o_o_list as ooo}
				<div class="border border-gray-300 rounded-lg overflow-hidden mb-4">
					<a href="/student/{ooo.user_id}/course" class="p-8 flex items-center bg-gray-100 shadow border-b border-gray-300 hover:text-blue-500 group hover:bg-white">
						<img class="w-20 rounded-full" src={ooo.avatar_filepath} alt={ooo.username}>
						<div class="ml-4 flex-1">
							<p class="font-bold mb-1">{ooo.nickname}</p>
							<div class="text-sm flex">
								<div class="px-4 py-1 border border-gray-300 text-gray-500 rounded-full">{slugToText(ooo.level)}</div>
								<div class="ml-2 px-4 py-1 border border-gray-300 text-gray-500 rounded-full">{slugToText(ooo.gender)}</div>
							</div>
						</div>
						<div class="mr-2 pl-4 pr-2 py-2 rounded text-white text-p2 inline-flex items-center" style="background: {ooo.status_color}">
							<div class="mr-2">{slugToText(ooo.status_key)}</div>
<!--							<Icon name="right" className="w-4"/>-->
						</div>
					</a>
				</div>
			{/each}
		{/if}
	</div>
</div>