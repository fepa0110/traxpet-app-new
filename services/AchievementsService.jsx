import { urlServer } from "constants/constants";

const levelsEndPoint = "/niveles"

export async function getLevels() {
    return await fetch(`${urlServer}${levelsEndPoint}`)
    .then((response) => {
        return response.json();
    });
}

export async function getLevelByUsername(username){
    return await fetch(urlServer + levelsEndPoint + "/calcularNivel?username="  + username)
        .then((response) => { return response.json()});
}

export async function getGivenLevelsByUsername(username){
    return await fetch(urlServer + levelsEndPoint + "/nivelesObtenidos?username="  + username)
        .then((response) => { return response.json()});
}