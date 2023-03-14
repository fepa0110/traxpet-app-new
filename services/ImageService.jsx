import { urlServer } from "../constants/constants";

const formatoImagen = "jpg";

export async function sendImage(image, mascotaId) {
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
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return await responseImage.json();
  } catch (error) {
    console.log("errorUploadImagen ", error);
  }
}

export async function updateImage(imagenData, mascotaId, imagenId){
  console.log("imagen mascota data c",imagenData)
    return await fetch(urlServer + "/imagenesMascota/update?" +
  "mascotaId=" + mascotaId +
  "&formatoImagen=" + formatoImagen +
  "&imagenId=" + imagenId
  , {
    method: 'PUT',
    body: JSON.stringify(imagenData),
    // mode: "no-cors",c

    headers: {
      'Content-Type': 'multipart/form-data; ',
    },
  })
  .then((response) => { 
  
    return response.json() })
  .catch((error) => {
    

    console.log("error UpdateImage: ",error);
  });

}

export async function getImagesByMascotaId(mascotaId) {
  return await fetch(
      urlServer + "/imagenesMascota/" + mascotaId
  ).then((response) => {
      return response.json();
  });
}
