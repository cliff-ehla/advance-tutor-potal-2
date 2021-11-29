<script>
	import {onMount} from 'svelte'
	import {tutor_group_store} from "../../../store";
	import {stores} from '$app/stores'
	import TopBar from '../../../components/student-top-bar.svelte'
	import {getZoomMaterialHistory} from "../../../api/zoom-api";
	import {getItem} from "../../../api/item-api";
	import dayjs from "dayjs";
	import RateLabel from '../../../components/zoom/rate-label.svelte'

	const {page} = stores()
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO($page.params.user_id) : null

	let history
	let loading = false
	let preview_image

	const onPreview = async (id) => {
		let data = await getItem(id)
		preview_image = data.pdf_array
	}

	onMount(async () => {
		history = await getZoomMaterialHistory(fetch, $page.params.user_id)
	})
</script>

{#if o_o_o}
	<TopBar {o_o_o} segment="learning-history"/>
{/if}

<div>
	<div class="flex bg-white" style="height: calc(100vh - 160px)">
		<div class="flex-1 h-100 overflow-scroll">
			<p class="font-bold px-4 py-4 text-blue-500 bg-blue-200">Learning history</p>
			{#if history}
				{#each history as h}
					<div on:click={() => {onPreview(h.item_id)}} class="px-4 py-3 flex items-center border-b border-gray-200 group cursor-pointer">
						<div class="w-20 h-20 bg-cover rounded" style="background-image: url({h.thumbnail_path})"></div>
						<div class="mx-4 flex-1">
							<p class="text-gray-500 mb-2">{dayjs(h.start_date).format('DD MMM YYYY')}</p>
							<p>{h.title}</p>
						</div>

						<div class="mr-4">
							<RateLabel rate={h.t_difficulty_rate}/>
						</div>

						<button class="bg-blue-500 text-white px-4 py-2 rounded group-hover:bg-blue-700">Preview</button>
					</div>
				{/each}
			{/if}
		</div>
		<div class="w-64 border-l bg-white h-100 overflow-scroll p-4">
			{#if preview_image}
				{#each preview_image as src}
					<img {src} alt="preview" class="mb-2">
				{/each}
			{:else}
				<div class="pt-12 text-center text-gray-400 font-bold">
					Click to preview
				</div>
			{/if}
		</div>
	</div>
</div>