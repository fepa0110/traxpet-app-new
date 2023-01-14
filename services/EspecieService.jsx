import React from 'react'

import { urlServer } from "../constants/constants";


  export async function  getEspecies ()  {
    const resp = await fetch(urlServer + "/especies");
    const data = await resp.json();
    return data;
  };


  export async function sendFeatures (data) {
    fetch(urlServer + "/especies", {
      method: "POST", // or 'PUT'
      body: JSON.stringify(data),
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  };

  export async function  disabledEspecie (especieSeleccionada)  {
    //console.log(this.state.especieSeleccionada)
    const resp = await fetch(urlServer + "/especies/desabilitar", {
      method: "PUT",
      body: especieSeleccionada,
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

    // this.getEspeciesData();

    // this.hideAlertConfirm();

    // setEspecieSeleccionada([""]);
  };