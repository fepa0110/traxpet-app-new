import { urlServer } from "../constants/constants";

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
