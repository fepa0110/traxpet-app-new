import { urls } from "constants/constants";

export const getFeaturesBySpecieName = async (specieName) => {
  const response = await fetch(
    urls.server + "/valores/caracteristicasByEspecie?especieNombre=" + specieName
  );
  return await response.json();
};

export const sendFeaturesData = async (caracteristica) => {
  const response = await fetch(urls.server + "/caracteristicas", {
    method: "POST",
    body: JSON.stringify(caracteristica),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export const getFeatures = async () => {
  const response = await fetch(urls.server + "/caracteristicas");
  return await response.json();
};
