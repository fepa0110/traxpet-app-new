import { urlServer } from "../constants/constants";

export async function readNotification(notificacion) {
  try {
    const response = await fetch(urlServer + "/notificaciones", {
      method: "PUT", // or 'PUT'
      body: JSON.stringify(notification),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.log("Ha ocurrido un error");
  }
}

export async function getNotificacionesByUserIdRequest(userId) {
  return await fetch(`${urlServer}/notificaciones/usuario/${userId}`).then(
    (response) => {
      return response.json();
    }
  );
}
