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
	import relativeTime from "dayjs/plugin/relativeTime.js";
	import {tooltip} from "$lib/action/tooltip.js";
	dayjs.extend(relativeTime)
	let filter = 'all'
	$: filtered_list = $noticeCenterStore.writing_list.filter(w => {
		if (filter === 'all') {
			return true
		} else if (filter === 'pending') {
			return w.disclose !== '1'
		} else if (filter === 'completed') {
			return w.disclose === '1'
		}
	})
</script>

<div class="bg-gray-50">
	<div class="container py-4">
		<div class="page-title mb-2">Writing submission</div>
		<div class="flex mb-4 items-center">
			<span class="text-gray-500 text-sm mr-4">Filter:</span>
			{#each ['all', 'pending', 'completed'] as f,i}
				<button class:active={filter === f} class="px-2 text-gray-500 bg-gray-100 mr-1 rounded text-sm py-1 hover:text-blue-500 hover:bg-blue-50" on:click={() => {filter = f}}>{capitalize(f)}</button>
				{#if i === 0}
					<span style="width: 1px" class="h-4 mr-3 ml-2 bg-gray-400"></span>
				{/if}
			{/each}
		</div>
		{#if filtered_list.length}
			{#each filtered_list as w}
				<a href="/writing/{w.identifier}" class="cursor-pointer pl-4 pr-2 py-4 border border-gray-200 my-2 rounded leading-none bg-white flex items-center hover:border-blue-300 hover:bg-blue-50">
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
							<div class="flex items-center">
								<div class="inline-flex border items-center border-gray-300 pl-2 bg-white rounded-full text-sm">
									<div class="w-2 h-2 bg-green-500 rounded-full"></div>
									<p class="ml-2 text-gray-500">
										{#if w.is_read === '1'}
											Student received
										{:else}
											Marking sent
										{/if}
									</p>
									<p class="ml-2 w-8 h-8 rounded-full cc bg-gray-100 text-gray-700 border-l border-gray-300">{Number(w.organizations_mark) + Number(w.vocabulary_mark) + Number(w.sentence_mark) + Number(w.content_mark)}</p>
								</div>
								<div class="w-8">
								{#if w.overall_msg}
									<div class="ml-2" use:tooltip={w.overall_msg}>
										<Icon name="report" className="w-4 text-gray-500"/>
									</div>
								{/if}
								</div>
							</div>
						{:else if w.disclose === null || w.disclose === '0'}
							<div class="inline-flex border items-center border-gray-300 pl-2 bg-white pr-4 rounded-full py-1 text-sm">
								<div class="w-2 h-2 bg-red-500 rounded-full"></div>
								<p class="ml-2 text-gray-500">
									{#if w.next_lesson_date}
										{dayjs(w.next_lesson_date).fromNow()}
									{:else}
										No more class
									{/if}
								</p>
							</div>
						{/if}
					</div>
					<div class="w-1/4 flex justify-end">
						{#if w.disclose === '1'}
							{#if w.is_read === '1'}
								<a href="/writing/{w.identifier}" class="secondary-button">View</a>
							{:else}
								<a href="/writing/{w.identifier}" class="secondary-button">Edit</a>
							{/if}
						{:else if w.disclose === '0'}
							<a href="/writing/{w.identifier}" class="button">Continue</a>
						{:else if w.disclose === null}
							<button class="button">Mark now</button>
						{/if}
						<div class="ml-0.5">
							<Dropdown placement="bottom-end" activator_style="icon-button text-gray-500" activator_active_style="bg-white">
								<button slot="activator">
									<Icon name="more" className="w-4"/>
								</button>
								<div class="dropdown">
									<a href="/students/{w.student_id}/tutor-group/{w.tutor_group_id}" class="item">Go to course</a>
								</div>
							</Dropdown>
						</div>
					</div>
				</a>
			{/each}
		{:else}
			{#if filter === 'all'}
				<p class="text-gray-500 p-8 bg-white">No writing submission</p>
			{:else if filter === 'pending'}
				<p class="text-gray-500 p-8 bg-white">You have no pending writing submission to mark</p>
			{:else}
				<p class="text-gray-500 p-8 bg-white">You have not yet completed any marking yet</p>
			{/if}
		{/if}
	</div>
</div>

<style>
	.active {
		@apply font-bold text-black bg-blue-50 text-blue-500;
	}
</style>