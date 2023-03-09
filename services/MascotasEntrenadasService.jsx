import { urlServer } from "../constants/constants";

export async function getByModeloActivoEspecie(especieNombre) {
	return await fetch(
		urlServer + "/mascotasEntrenadas/predict/" + especieNombre
	).then((response) => {
		return response.json();
	});
}
