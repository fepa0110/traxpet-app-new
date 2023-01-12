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