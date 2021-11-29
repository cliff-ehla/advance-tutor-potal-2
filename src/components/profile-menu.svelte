<script>
	import Dropdown from './ui-elements/dropdown3.svelte'
	import {stores} from '$app/stores'
	const {session} = stores()
	import Icon from './ui-elements/icon.svelte'
	import {org_store} from "../store";
	$: user_info = $session.user_info

	$: is_school = $org_store.o_type === 'SCHOOL'
	console.log($session)

	const menu = [
		{
			href: '/profile',
			name: 'Profile',
			is_school: true
		},
		{
			href: '/workday-setting/available',
			name: 'Availability setting',
			is_school: false
		},
		{
			divider: true
		},
		{
			href: '/logout',
			name: 'Logout',
			is_school: true
		}
	]
</script>
{#if user_info}
	<div class="flex items-center">
		{#if !is_school}
			<Dropdown placement="bottom-end" activator_active_style="bg-gray-200" activator_style="bg-gray-100 border border-gray-300 w-8 h-8 rounded-full inline-flex items-center justify-center">
				<div slot="activator">
					<Icon name="info" className="w-4"/>
				</div>
				<div class="bg-white shadow-lg py-4 rounded border border-gray-300">
					<a target="_blank" href="https://ehla-media-bucket.s3.ap-southeast-1.amazonaws.com/pdf/User_guide_teaching_portal_210917.pdf" class="text-sm px-4 py-2 flex hover:bg-gray-100 hover:text-blue-500">
						<Icon name="download" className="w-4 mr-2"/>
						<span class="flex-1">User guide</span>
					</a>
					<a target="_blank" href="https://ehla-media-bucket.s3.ap-southeast-1.amazonaws.com/pdf/EHLA+Teacher+administrative+stuff.pdf" class="text-sm px-4 py-2 flex hover:bg-gray-100 hover:text-blue-500">
						<Icon name="download" className="w-4 mr-2"/>
						<span class="flex-1">Administrative stuff</span>
					</a>
				</div>
			</Dropdown>
			<div class="w-4"></div>
		{/if}
		<Dropdown placement="bottom-end">
			<div slot="activator" class="inline-flex items-center">
				<div class="rounded-full w-10 h-10 bg-cover bg-center" style="background-image: url({$session.user_info.profile_pic})"></div>
				<div class="ml-2 leading-none">
					<p class="text-xs text-gray-500">Teacher</p>
					<p class="max-w-xs text-sm text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis">
						{user_info.nickname}
					</p>
				</div>
			</div>
			<div class="bg-white shadow-lg py-4 rounded border border-gray-300">
				<p class="text-sm px-4 py-2 text-gray-400">Teacher, {user_info.nickname || user_info.username}</p>
				<div class="h-0.5 bg-gray-200 my-1 mx-4"></div>
				{#each menu as m}
					{#if m.divider}
						<div class="h-0.5 bg-gray-200 my-1 mx-4"></div>
					{:else}
						{#if !(is_school && !m.is_school)}
							<a href={m.href} class="text-sm px-4 py-2 flex hover:bg-gray-100 hover:text-blue-500">
								<span class="flex-1">{m.name}</span>
								<Icon name="right" className="w-3"/>
							</a>
						{/if}
					{/if}
				{/each}
			</div>
		</Dropdown>
	</div>
{/if}