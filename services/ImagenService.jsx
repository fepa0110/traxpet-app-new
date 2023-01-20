import { urlServer } from "../constants/constants";

export async function getImagesByMascotaId(mascotaId) {
    return await fetch(
        urlServer + "/imagenesMascota/" + mascotaId
    ).then((response) => {
        return response.json();
    });
}
