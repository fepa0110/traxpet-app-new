import React from "react";

import { urls } from "constants/constants";

export async function getValuesDataByFeatureAndSpecie(
  especieNombre,
  caracteristica
) {
  return await fetch(
    urls.server +
      "/valores/allByEspecieYCaracteristica?especieNombre=" +
      especieNombre +
      "&&caracteristicaNombre=" +
      caracteristica
  ).then((response) => {
    return response.json();
  });
}

export const saveValor = async (data) => {
  console.log("Save valor");
  console.log(data.length);
  const response = await fetch(urls.server + "/valores/byList", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

export async function disabledValue(data) {
  await fetch(urls.server + "/valores", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error))
    .then((json) => {
      console.log(json);
    });
}
