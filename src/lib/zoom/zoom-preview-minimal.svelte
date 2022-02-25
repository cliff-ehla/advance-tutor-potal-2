<!-- used inside student overview -->

<script>
	import dayjs from "dayjs";
	import Icon from '$lib/ui/icon.svelte'
	import {getContext} from "svelte";
	const {showPopper} = getContext('popper')
	import {tooltip} from "$lib/aciton/tooltip.js";
	import ZoomPreviewPopup from '$lib/zoom/zoom-preview-popup.svelte'
	import {rc_level_to_label} from "$lib/store/rc-level-to-label.js";

	export let zoom
	let type = zoom.big_classroom_type
	let room_size = type === 'SMALL' ? 4 : type === 'UNLIMITED' ? 9999 : 20

	const previewMaterial = async (e, zoom) => {
		showPopper(e.target, ZoomPreviewPopup, {
			zoom
		}, {
			placement: 'right'
		})
	}
</script>


<div on:click={(e) => {previewMaterial(e,zoom)}} class="flex cursor-pointer hover:bg-gray-100 hover:text-blue-500">
	<div class="flex-shrink-0">
		<div class="w-8 h-12 cc bg-gray-100 leading-tight text-center">
			<div>
				<p class="text-gray-500">{dayjs.utc(zoom.start_date).local().format('DD')}</p>
				<p class="text-gray-500 text-xs">{dayjs.utc(zoom.start_date).local().format('MMM')}</p>
			</div>
		</div>
	</div>
	<div class="ml-2 mt-0.5">
		<div class="italic text-xs text-gray-400">
			{#if zoom.is_big_classroom}
				<div class="flex mt-0.5">
					<div use:tooltip={'Classroom'}>
						<Icon name="classroom" className="text-purple-500 w-4"/>
					</div>
					<p class="ml-1 text-xs text-purple-500">{zoom.students.length}/{room_size}</p>
					<p class="bg-purple-100 text-purple-500 text-white ml-1 px-1 text-xs rounded-sm overflow-hidden whitespace-nowrap overflow-ellipsis" style="max-width: 80px;">{rc_level_to_label[zoom.rc_level] || zoom.rc_level}</p>
					<p use:tooltip={zoom.sub_cat_en} class="bg-purple-500 text-white ml-1 px-1 text-xs rounded-sm overflow-hidden whitespace-nowrap overflow-ellipsis" style="max-width: 80px;">#{zoom.description_code_short_id}</p>
				</div>
			{:else}
				<div class="flex items-start">
					<div use:tooltip={'One on one'}><Icon name="one-on-one" className="text-black w-4 mr-1"/></div>
					<a use:tooltip={zoom.title.split('(')[0]} class="hover:underline w-44 overflow-ellipsis overflow-hidden whitespace-nowrap" href="/students/{zoom.students[0].user_id}/tutor-group/{zoom.tutor_group_id}">
						{zoom.title.split('(')[0]}
					</a>
				</div>
			{/if}
		</div>
		{#if zoom.days.length}
			{#each zoom.days as d}
				<div>
					<div class="inline-flex items-center cursor-pointer hover:text-blue-500 mb-1 text-sm">
						<p class="leading-tight mr-2">{d.title}</p>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-gray-400">No material</p>
		{/if}
	</div>
</div>
