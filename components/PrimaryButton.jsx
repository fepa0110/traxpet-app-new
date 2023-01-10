/** Boton primario standard
 * Props:
 *  actionFunction: onPress function
 *  title: Texto del boton
 */
import { React } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ColorsApp } from "../constants/Colors";

const PrimaryButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.primaryButton}
      onPress={props.actionFunction}
    >
      <Text style={styles.textPrimaryButton}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textPrimaryButton: {
    color: "white",
  },
  primaryButton: {
    backgroundColor: ColorsApp.primaryColor,
    alignItems: "center",
    alignContent: "center",

    justifyContent: "center",
    width: 115,
    height: 40,
    flexDirection: "row",
    borderRadius: 50,
  },
});
export default PrimaryButton;
