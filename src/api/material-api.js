import {http} from "$lib/http";
import {material_store} from "../store";

export async function getUserMaterial (child_id, _fetch) {
	try {
		const {data} = await http.get(`userMaterialApi/user_material_list?child_id=${child_id}`, _fetch)
		material_store.set(data)
		return data
	} catch (e) {}
}