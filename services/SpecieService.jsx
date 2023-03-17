import { urls } from "constants/constants";

export async function getEnabledSpecies() {
  const response = await fetch(urls.server + "/especies/enabled");
  return await response.json();
}

export const getSpeciesUsables = async () => {
  const response = await fetch(urls.server + "/especies/usables");
  return await response.json();
};

export async function getEspecies() {
  const response = await fetch(urls.server + "/especies");
  return await response.json();
}

export async function sendSpecie(specie) {
  const response = await fetch(urls.server + "/especies", {
    method: "POST",
    body: JSON.stringify(specie),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
}

export async function disableEspecieRequest(especieNombre) {
  const response = await fetch(urls.server + "/especies/deshabilitar/"+especieNombre, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return await response.json();
}
