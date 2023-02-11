import { urlServer } from "../constants/constants";


export async function getLevels() {
    return await fetch(
        `${urlServer}/logros`
    ).then((response) => {
        return response.json();
    });
  }