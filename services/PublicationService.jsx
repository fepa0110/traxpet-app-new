import { urlServer } from "../constants/constants";

const publicacionesEndPoint = "/publicaciones"

export async function getPublicacionesByUserRequest(username) {
	return await fetch(`${urlServer}/publicaciones/usuario/${username}`)
		.then((response) => {return response.json()}
	);
}

export async function getPublicacionById(publicacionId) {
	return await fetch(urlServer + publicacionesEndPoint + "/" + publicacionId)
	.then((response) => {
		return response.json();
	});
}

export async function sendPublication(publicationData, notificateSimilar, mascotaSimilarId) {
	try {
		const responsePublication = await fetch(
			`${urlServer}${publicacionesEndPoint}?notificateSimilar=${notificateSimilar}&idMascotaSimilar=${mascotaSimilarId}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(publicationData),
		});

		return await responsePublication.json();
	} catch (error) {
		console.log("errorNewPublication ", error);
	}
}

export async function updatePublication(publicationId, publicationData) {
	return await fetch(urlServer + publicacionesEndPoint + "/update/" + publicationId, {
		method: "PUT",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(publicationData),
		// mode: "no-cors",
	})
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log("error ", error);
		});
}

export async function addUbicacionMascota(ubicacion, mascotaId) {
	return await fetch(
		urlServer + publicacionesEndPoint + "/addUbicacion?mascotaId=" + mascotaId,
		{
			method: "PUT",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(ubicacion),
			// mode: "no-cors",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log("error ", error);
		});
}

export async function markAsFound(publicationId){
	return await fetch(
		urlServer + "/publicaciones/markAsFound/" + publicationId,
		{
			method: "PUT",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log("error ", error);
		});
};

export async function getPublicationByPetId(id) {
	return await fetch(urlServer + "/publicaciones/mascota/" + id)
	.then((response) => {
		return response.json();
	});
}