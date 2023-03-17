import {urls} from "constants/constants";

const levelsEndPoint = "/niveles"

export async function getLevels() {
    return await fetch(`${urls.server}${levelsEndPoint}`)
    .then((response) => {
        return response.json();
    });
}

export async function getLevelByUsername(username){
    return await fetch(urls.server + levelsEndPoint + "/calcularNivel?username="  + username)
        .then((response) => { return response.json()});
}

export async function getGivenLevelsByUsername(username){
    return await fetch(urls.server + levelsEndPoint + "/nivelesObtenidos?username="  + username)
        .then((response) => { return response.json()});
}