import { urlServerBoosting } from "../constants/constants";

export async function getPredictByPublication(publication) {
  try {
    const response = await fetch(urlServerBoosting + "/predict", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(publication),
    });
    const predict = await response.json();
    return predict;
  } catch (error) {
    console.log("error", error);
  }
}
