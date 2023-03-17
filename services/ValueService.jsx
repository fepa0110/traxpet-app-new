import {urls} from "constants/constants";

export async function getFeaturesMapByPredict(predict) {
	return await fetch(urls.server + "/valores/byMascotas",{
    method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(predict),
  })
		.then((response) => {
			return response.json();
		})
		.catch((error) => console.log("error: ", error));
}
