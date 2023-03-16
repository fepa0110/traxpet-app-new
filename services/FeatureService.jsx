import { urlServer } from "constants/constants";

export async function getFeaturesBySpecieName(specieName) {
  try {
    const response = await fetch(
      urlServer +
        "/valores/caracteristicasByEspecie?especieNombre=" +
        specieName
    );
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("error", error);
  }
}

export async function getFeatures() {
  const resp = await fetch(urlServer + "/caracteristicas");
  const data = await resp.json();
  return data;
}
