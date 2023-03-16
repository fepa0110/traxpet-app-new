/** Boton primario largo
 * Props:
 *  title: Texto del boton
 *  actionFunction: onPress function
 *  disabled: habilitacion del boton
 */

import { React } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ColorsApp } from "constants/Colors";

const LargePrimaryButton = (props) => {
    return (
        <TouchableOpacity
            style={[styles.primaryButton,props.extraStyles]}
            onPress={props.actionFunction}
            disabled={props.disabled}
        >
            <Text style={styles.textPrimaryButton}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textPrimaryButton: {
        color: ColorsApp.primaryButtonTextColor,
        fontSize: 16,
        fontWeight: "bold",
    },
    primaryButton: {
        backgroundColor: ColorsApp.primaryColor,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        width: 250,
        height: 40,
        flexDirection: "row",
        borderRadius: 50,
    },
});
export default LargePrimaryButton;
