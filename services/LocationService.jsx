import {urls} from "constants/constants";

export async function getPublicationLocations(publicationId) {
    return await fetch(
        `${urls.server}/ubicaciones/publicacion/${publicationId}`
    ).then((response) => {
        return response.json();
    });
}
