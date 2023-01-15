import { urlServer } from "../constants/constants";

export async function getEnabledSpecies() {
  try {
    const response = await fetch(urlServer + "/especies/enabled");
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("error", error);
  }
}

export async function getEspecies() {
  return await fetch(urlServer + "/especies")
    .then((response) => {return response.json()});
};

export async function sendFeatures(data) {
  fetch(urlServer + "/especies", {
    method: "POST", // or 'PUT'
    body: JSON.stringify(data),
    // mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

export async function disabledEspecie(especieSeleccionada) {
  await fetch(urlServer + "/especies/desabilitar", {
    method: "PUT",
    body: especieSeleccionada,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error))
};