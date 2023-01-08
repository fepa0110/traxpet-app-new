import { View, Text } from 'react-native'
import React from 'react'

import { urlServer } from "../constants/constants";

export async function getNotificacionesByUserIdRequest(userId){
    return await fetch(`${urlServer}/notificaciones/usuario/${userId}`)
        .then((response) => {
            return response.json()
        });
}