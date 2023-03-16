import { urlServer } from "constants/constants";

const publicacionesEndPoint = "/publicaciones";

export async function getPublicacionesByUserRequest(username) {
  return await fetch(`${urlServer}/publicaciones/usuario/${username}`).then(
    (response) => {
      return response.json();
    }
  );
}

export async function getPublicacionesVistasByUserRequest(username) {
  const response = await fetch(
    `${urlServer}/publicaciones/vistasByUsername/${username}`
  );
  const json = await response.json();
  return json;
}

export async function getPublicacionesBuscadasByUserRequest(username) {
  const response = await fetch(
    `${urlServer}/publicaciones/buscadasByUsername/${username}`
  );
  const json = await response.json();
  return json;
}

export async function getPublicacionById(publicacionId) {
  return await fetch(
    urlServer + publicacionesEndPoint + "/" + publicacionId
  ).then((response) => {
    return response.json();
  });
}

export async function sendPublication(
  publicationData,
  notificateSimilar,
  mascotaSimilarId
) {
  try {
    const responsePublication = await fetch(
      `${urlServer}${publicacionesEndPoint}/publicar?notificateSimilar=${notificateSimilar}&idMascotaSimilar=${mascotaSimilarId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publicationData),
      }
    );
    console.log("publicaciondata: ", JSON.stringify(publicationData));

    return await responsePublication.json();
  } catch (error) {
    console.log("errorNewPublication ", error);
  }
}

export async function updatePublication(publicationId, publicationData) {
  return await fetch(
    urlServer + publicacionesEndPoint + "/update/" + publicationId,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(publicationData),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log("error ", error);
    });
}

export async function addUbicacionMascota(ubicacion, mascotaId) {
  const response = await fetch(
    urlServer + publicacionesEndPoint + "/addUbicacion?mascotaId=" + mascotaId,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ubicacion),
    }
  );
  return await response.json();
}

export async function markAsFound(publicationId) {
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
}

export async function getPublicationByPetId(id) {
  const response = await fetch(urlServer + "/publicaciones/mascota/" + id);
  return await response.json();
}

export async function migrarDueño(publicacionId, username) {
  const response = await fetch(
    `${urlServer}${publicacionesEndPoint}/migrarDueño?publicacionId=${publicacionId}&username=${username}`,
    {
      method: "PUT",
    }
  );
  return await response.json();
}
