<script>
	import Icon from '../../../../components/ui-elements/icon.svelte'
	import {lesson_type as lesson_type_map, tutor_group_store} from "../../../../store";
	import {stores} from '$app/stores'
	import {org_store} from "../../../../store";

	const {page} = stores()
	$: user_id = $page.query.user_id
	$: c_id = $page.query.c_id
	$: is_school = $org_store.o_type === 'SCHOOL'

	export let tutor_group
	export let lesson
	$: lesson_type = lesson ? $lesson_type_map[lesson.type] : {}
	$: o_o_o = $tutor_group_store ? tutor_group_store.getOOO(user_id) : null
	$: _class = $tutor_group_store ? tutor_group_store.getClass(c_id) : null
</script>

<div class="flex items-center border-b border-gray-300 sticky top-0 left-12 right-0 bg-white z-50">
	<a href="{user_id ? `/student/${user_id}/course` : is_school ? `/classes/${c_id}` : '/tutor-group'}" class="p-2 px-2 hover:bg-gray-200 inline-flex items-center">
		{#if user_id && o_o_o}
			<div class="inline-flex items-center">
				<img class="w-6 h-6 rounded-full" src={o_o_o.avatar_filepath} alt="avatar">
				<div class="ml-2 text-sm">{o_o_o.nickname || o_o_o.username}</div>
			</div>
		{:else if c_id}
			<span>{_class && _class.name}</span>
		{:else}
			<div class="w-6 h-6 rounded flex items-center justify-center">
				<Icon name="user-group" className="w-4"/>
			</div>
		{/if}
	</a>
	<Icon name="right" className="w-3"/>
	<a href="/tutor-group/{tutor_group.tutor_group_id}/app-tasks{user_id ? `?user_id=${user_id}` : c_id ? `?c_id=${c_id}` : ''}" class="p-2 px-2 hover:bg-gray-200 inline-flex items-center">
		<div class="w-6 h-6 rounded text-white flex items-center justify-center" style="background-color: {tutor_group.color}">
			<Icon name="writing" className="w-4"/>
		</div>
		<p class="text-sm text-gray-500 ml-2 max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
			{tutor_group.title}
		</p>
	</a>
	<Icon name="right" className="w-3"/>
	<a href="/tutor-group/{tutor_group.tutor_group_id}/{lesson.day_id}{user_id ? `?user_id=${user_id}` : c_id ? `?c_id=${c_id}` : ''}" class="p-2 hover:bg-gray-200 inline-flex items-center">
		<div class="{lesson_type && lesson_type.color} text-white flex-shrink-0 w-6 h-6 rounded-full flex justify-center items-center">
			<Icon className="w-4" name="{lesson_type && lesson_type.icon}"/>
		</div>
		<p class="ml-1 text-sm text-gray-500">{lesson.title}</p>
	</a>
	<Icon name="right" className="mx-2 w-3"/>
	<p class="text-sm text-gray-500"><slot/></p>
</div>