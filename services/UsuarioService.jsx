import { View, Text } from 'react-native'
import React from 'react'

import { urlServer } from "../constants/constants";

export async function loginRequest(userData) {
    return await fetch(urlServer + "/usuarios/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then((response) => {
            return response.json();
        })
        .catch((response) => {
            return response.json();
        });
}

export async function registerUserRequest(newUserData) {
    return await fetch(urlServer + "/usuarios", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserData)
    })
        .then((response) => {
            return response.json();
        })
        .catch((response) => {
            return response.json();
            console.log("Se produjo un error al registrarse en el sistema");
        });
}

export async function getUserByUsernameRequest(username) {
    return await fetch(`${urlServer}/usuarios/username/${username}`)
        .then((response) => {
            return response.json()
        }
    )
}

export async function getUserByEmailRequest(email) {
    return await fetch(`${urlServer}/usuarios/email/${email}`)
        .then((response) => { 
            return response.json()
        }
    )}

    export async function addScore(usuario,puntaje) {
        await fetch(urlServer + "/usuarios/addScore"+puntaje, {
          method: "PUT",
          body: usuario,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        })
          .then((response) => {return response.json()})
          .catch((error) => console.log(error))
      };

export async function addScoreUserByUsername(username, puntaje){
    return await fetch(urlServer+"/usuarios/addScore/"+puntaje, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username: username}),
    })
        .then((response) => {
            return response.json();
        })
        .catch((response) => {
            return response.json();
        });
}