import { urlServer } from "../constants/constants";

export async function getPublicacionesByUserRequest(username) {
    return await fetch(`${urlServer}/publicaciones/usuario/${username}`)
        .then((response) => {
            return response.json()
        })
}