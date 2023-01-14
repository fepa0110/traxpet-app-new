import React from "react";

import { urlServer } from "../constants/constants";

export async function getCaracteristicas() {
  const resp = await fetch(urlServer + "/caracteristicas");
  const data = await resp.json();
  return data;
 
}
