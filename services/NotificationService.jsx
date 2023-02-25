import { urlServer } from "../constants/constants";

export async function readNotification(notificacion) {
	return await fetch(urlServer + "/notificaciones", {
		method: "PUT", // or 'PUT'
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
	return await fetch(`${urlServer}/notificaciones/usuario/${userId}`).then(
		(response) => {
			return response.json();
		}
	);
}


export async function sendNotificationOwnerUser(idSelectPet,idPublication,) {
	return await fetch(`${urlServer}/notificaciones/${idSelectPet}/${idPublication}`, {
		method: "POST", 
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
