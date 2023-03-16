/** Boton con solo icono
 * Props:
 *  onPressFunction: onPress Function
 *  iconName: Nombre del icono deseado
 *  size: tamaño del boton
 */
import { TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";

import { ColorsApp } from "constants/Colors";

const IconButton = (props) => {
    return (
      <TouchableOpacity
        style={styles(props.size).button}
        onPress={props.onPressFunction}
      >
        <FontAwesome5
          name={props.iconName}
          size={props.size/2}
          color={ColorsApp.primaryButtonTextColor}
        />
      </TouchableOpacity>
    );
};

const styles = (size) => StyleSheet.create({
    button: {
        backgroundColor: ColorsApp.primaryColor,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
    },
});

export default IconButton;
