import React from 'react'

import {urls} from "constants/constants";

export async function getValuesDataByFeatureAndSpecie (especieNombre,caracteristica) {
  return await fetch(
    urls.server +
      "/valores/allByEspecieYCaracteristica?especieNombre=" +
      especieNombre +
      "&&caracteristicaNombre=" +
      caracteristica
  )
  .then((response) => { return response.json() })
};

export async function saveValor(data) {
  await fetch(urls.server + "/valores", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
};

export async function disabledValue(data) {
  await fetch(urls.server + "/valores", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error))
    .then((json) => {
      console.log(json);
    });
};