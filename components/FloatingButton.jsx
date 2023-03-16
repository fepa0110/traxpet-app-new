/**Boton flotante abajo a la derecha
 * Props:
 *  visible: mostrar boton
 *  onPressFunction: onPress function
 */

import { View, Text } from 'react-native'
import React from 'react'

import { FAB } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsApp } from "constants/Colors";

const FloatingButton = (props) => {
    return (
        <FAB
            visible={props.visible}
            placement="right"
            icon={
                <FontAwesome5
                    name="plus"
                    size={22}
                    color={ColorsApp.primaryButtonTextColor}
                />}
            color={ColorsApp.primaryColor}
            onPress={props.onPressFunction}
        /> 
    )
}

export default FloatingButton