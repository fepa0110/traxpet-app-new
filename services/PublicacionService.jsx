import { View, Text } from 'react-native'
import React from 'react'

import { urlServer } from "../constants/constants";

export async function getPublicacionesByUserRequest(username) {
    return await fetch(`${urlServer}/publicaciones/usuario/Teo`)
        .then((response) => {
            return response.json()
        })
}