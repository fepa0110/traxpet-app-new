import {urls} from "constants/constants";

export async function getByModeloActivoEspecie(especieNombre,usuarioId) {
	return await fetch(
		urls.server + "/mascotasEntrenadas/predict?especieNombre="+especieNombre+"&usuarioId=" + usuarioId
	).then((response) => {
		return response.json();
	});
}
