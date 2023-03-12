import { urlServer } from "../constants/constants";

export async function getByModeloActivoEspecie(especieNombre,usuarioId) {
	return await fetch(
		urlServer + "/mascotasEntrenadas/predict?especieNombre="+especieNombre+"&usuarioId=" + usuarioId
	).then((response) => {
		return response.json();
	});
}
