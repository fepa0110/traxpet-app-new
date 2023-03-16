import { urlServer } from "constants/constants";

export async function getPublicationLocations(publicationId) {
    return await fetch(
        `${urlServer}/ubicaciones/publicacion/${publicationId}`
    ).then((response) => {
        return response.json();
    });
}
