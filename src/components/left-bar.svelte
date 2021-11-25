<script>
	import {stores} from '$app/stores'
	import Icon from './ui-elements/icon.svelte'
	const {page, session} = stores()
	import {left_bar_visible} from "../store";
	import {org_store} from "../store";

	$: is_school = $org_store.o_type === 'SCHOOL'
	$: is_user_type_known = !!$org_store.o_type
	$: is_zoom_tab_active = $page.path === '/zoom'
	$: is_class_tab_active = $page.path.startsWith('/classes') || $page.query.c_id
	$: is_student_tab_active = $page.query.user_id || $page.path.startsWith('/student')
	$: active_href = is_zoom_tab_active ? '/zoom' : is_student_tab_active ? '/student' : is_class_tab_active ? '/classes' : '/tutor-group'

	const menu = [
		{
			icon: 'zoom',
			label: 'Zoom',
			href: '/zoom',
			is_school: false
		},
		{
			icon: 'user',
			label: 'One-on-one',
			href: '/student',
			is_school: false
		},
		{
			icon: 'user-group',
			label: 'Group class',
			href: '/tutor-group',
			is_school: false
		},
		{
			icon: 'user-group',
			label: 'Classes',
			href: '/classes',
			is_school: true
		}
	]
</script>

<div class="fixed inset-y-0 bg-white border-r border-gray-300 py-4 z-20 transition-transform transform" class:-translate-x-full={!$left_bar_visible}>
	<a href="/" class="block mb-4">
		<img src="/logo.png" alt="logo" class="w-10 mx-auto">
	</a>

	{#if is_user_type_known}
		{#each menu as m}
			{#if (m.is_school && is_school) || (!m.is_school && !is_school)}
				<a href="{m.href}" class="relative w-20 h-16 flex items-center justify-center mb-4"
				   class:bg-gray-100={m.href === active_href}
				   class:text-blue-500={m.href === active_href}
				>
					{#if m.href === active_href}
						<div class="absolute right-0 inset-y-2 w-1 bg-blue-500 rounded-full"></div>
					{/if}
					<div>
						<Icon className="mx-auto w-8 fill-current" name={m.icon}/>
						<p class="text-xxs text-center">{m.label}</p>
					</div>
				</a>
			{/if}
		{/each}
	{/if}
</div>