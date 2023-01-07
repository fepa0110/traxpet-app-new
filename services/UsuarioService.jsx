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