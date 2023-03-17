import { urls } from "constants/constants";

export async function readNotification(notificacion) {
	return await fetch(urls.server + "/notificaciones", {
		method: "PUT",
		body: JSON.stringify(notificacion),
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log("Ha ocurrido un error");
		});
}

export async function getNotificacionesByUserIdRequest(userId) {
	return await fetch(`${urls.server}/notificaciones/usuario/${userId}`).then(
		(response) => {
			return response.json();
		}
	);
}

export async function sendNotificationOwnerUser(idSelectPet, idPublication) {
	return await fetch(
		`${urls.server}/notificaciones/${idSelectPet}/${idPublication}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log("Ha ocurrido un error");
		});
}
