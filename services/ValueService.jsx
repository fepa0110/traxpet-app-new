import { urlServer } from "../constants/constants";

export async function getFeaturesMapByPredict(predict) {
  const mapFeatures = [];

  predict.map(async (pet) => {
    try {
      const response = await fetch(
        urlServer + "/valores/byMascota?idMascota=" + pet.id
      );
      const featuresData = await response.json();
      mapFeatures.push({
        id: pet.id,
        features: featuresData,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  });
  return mapFeatures;
}
