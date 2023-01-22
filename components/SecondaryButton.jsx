/** Boton primario standard
 * Props:
 *  actionFunction: onPress function
 *  title: Texto del boton
 *  disabled: Deshabilitar el boton
 */
import { React } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ColorsApp } from "../constants/Colors";

const SecondaryButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.secondaryButton}
      onPress={props.actionFunction}
      disabled={props.disabled}
    >
      <Text style={styles.textPrimaryButton}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textPrimaryButton: {
    color: ColorsApp.primaryColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    alignItems: "center",
    alignContent: "center",

    justifyContent: "center",
    width: 115,
    height: 40,
    flexDirection: "row",
    borderRadius: 50,
    borderColor: ColorsApp.primaryColor,
    borderWidth: 2,
  },
});
export default SecondaryButton;
