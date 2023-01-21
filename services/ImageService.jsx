import { urlServer } from "../constants/constants";

export async function sendImage(image, mascotaId) {
  const formatoImagen = "jpg";
  try {
    const responseImage = await fetch(
      urlServer +
        "/imagenesMascota/upload?" +
        "mascotaId=" +
        mascotaId +
        "&formatoImagen=" +
        formatoImagen,
      {
        method: "POST",
        body: image,
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      }
    );
    return await responseImage.json();
  } catch (error) {
    console.log("error ", error);
  }
}

export async function getImagesByMascotaId(mascotaId) {
  return await fetch(
      urlServer + "/imagenesMascota/" + mascotaId
  ).then((response) => {
      return response.json();
  });
}
