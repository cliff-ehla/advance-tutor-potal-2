<script context="module">
	import {http, onFail} from "$lib/http";
	import {noticeCenterStore} from "$lib/store/notice-center-store.js";

	export const load = async ({page, fetch}) => {
		const {success, debug} = await noticeCenterStore.fetchWriting(fetch)
		if (!success) return onFail(debug)
		return true
	}
</script>

<script>
	import dayjs from "dayjs";
	import {capitalize} from "$lib/helper/capitalize.js";
	import Dropdown from '$lib/ui/dropdown3.svelte'
	import Icon from '$lib/ui/icon.svelte'
</script>

<div class="bg-gray-50">
	<div class="container py-4">
		{#each $noticeCenterStore.writing_list as w}
			<div class="cursor-pointer pl-4 pr-2 py-4 border border-gray-200 my-1 rounded leading-none bg-white flex items-center">
				<div class="w-1/2">
					<p>{w.title || 'No title'}</p>
					<a href="/students/{w.student_id}" class="inline-flex items-center mr-2 rounded-full mt-1.5 group">
						<div class="w-5 h-5 rounded-full relative flex-shrink-0 cc bg-blue-600 text-white" style="font-size: 10px">
							{capitalize(w.level)}
						</div>
						<div class="group-hover:text-blue-500 text-sm text-gray-500 ml-1">
							<span class="text-sm">{w.nickname}</span>
							<span class="ml-1 italic text-xs text-gray-400">{dayjs(w.submission_date).format('DD/MM/YYYY')}</span>
						</div>
					</a>
				</div>
				<div class="w-1/4 flex justify-center">
					{#if w.disclose === '1'}
						<div class="inline-flex border items-center border-gray-300 pl-2 pr-4 rounded-full py-1 text-sm">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<p class="ml-2 text-gray-500">Completed</p>
						</div>
					{:else if w.disclose === null || w.disclose === '0'}
						<div class="inline-flex border items-center border-gray-300 pl-2 pr-4 rounded-full py-1 text-sm">
							<div class="w-2 h-2 bg-red-500 rounded-full"></div>
							<p class="ml-2 text-gray-500">3 days left</p>
						</div>
					{/if}
				</div>
				<div class="w-1/4 flex justify-end">
					{#if w.disclose === '1'}
					{:else if w.disclose === '0'}
						<button class="button">Continue</button>
					{:else if w.disclose === null}
						<button class="button">Mark now</button>
					{/if}
					<div class="ml-0.5">
						<Dropdown placement="bottom-end" activator_style="icon-button text-gray-500" activator_active_style="bg-blue-50">
							<button slot="activator">
								<Icon name="more" className="w-4"/>
							</button>
							<div class="dropdown">
								<a href="/students/{w.student_id}/tutor-group/{w.tutor_group_id}" class="item">Go to course</a>
							</div>
						</Dropdown>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
