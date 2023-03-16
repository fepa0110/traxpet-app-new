/** Boton secundario largo
 * Props:
 *  title: Texto del boton
 *  actionFunction: onPress function
 *  disabled: habilitacion del boton
 */

import { React } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ColorsApp } from "constants/Colors";

const LargeSecondaryButton = (props) => {
    return (
        <TouchableOpacity
            style={styles.primaryButton}
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
    primaryButton: {
        backgroundColor: ColorsApp.primaryBackgroundColor,
        borderColor: ColorsApp.primaryColor,
        borderWidth: 2,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        width: 250,
        height: 40,
        flexDirection: "row",
        borderRadius: 50,
    },
});
export default LargeSecondaryButton;
