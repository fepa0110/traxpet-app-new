import { StyleSheet, View } from "react-native";

import { urlServer } from "constants/constants";
import { useNavigation } from "@react-navigation/native";
import { ColorsApp } from "constants/Colors";
import React, { useState, useEffect } from "react";
import AwesomeAlert from "react-native-awesome-alerts";

import { getFeatures, sendFeaturesData } from "../services/FeatureService";

import Header from "@/Header";
import { Input } from "@rneui/themed";
import PrimaryButton from "@/PrimaryButton";

const NewFeatureAdminScreen = () => {
  const navigation = useNavigation();

  const [nombreCaracteristica, setNombreCaracteristica] = useState("");
  const [featuresValues, setFeaturesValues] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [featureExist, setFeatureExist] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const validations = async () => {
    const features = await getFeatures();
    const caracteristicaExitente = features.data.find(
      (caracteristica) =>
        caracteristica.nombre.toUpperCase().trim() ===
        nombreCaracteristica.toUpperCase().trim()
    );

    if (nombreCaracteristica.trim().length === 0) {
      showAlerts(
        "Error",
        "El campo nombre de caracteristica no puede estar vacio"
      );
    } else if (nombreCaracteristica.length > 50) {
      showAlerts(
        "Error",
        "El campo nombre de caracteristica no puede superar los 50 caracteres"
      );
    } else if (caracteristicaExitente != undefined) {
      showAlerts(
        "Error",
        "Ya existe la caracteristica: " + nombreCaracteristica
      );
    } else {
      sendFeaturesData({
        nombre: nombreCaracteristica.trim(),
      });
      navigation.goBack();
    }
  };

  const showAlerts = (title, messsage) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertMessage(messsage);
  };
  const hideAlert = () => {
    setShowAlert(false);
  };

  let alerta = () => {
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={ColorsApp.primaryColor}
        onConfirmPressed={() => {
          hideAlert();
        }}
      />
    );
  };

  return (
    <View style={{ width: "100%" }}>
      <Header title="Nueva caracteristica" />
      <View style={styles.container}>
        <Input
          label="Nombre de caracteristica"
          placeholder="Largo de pelaje"
          labelStyle={{ color: ColorsApp.primaryTextColor }}
          inputStyle={{ color: ColorsApp.primaryTextColor }}
          inputContainerStyle={{ color: ColorsApp.primaryTextColor }}
          containerStyle={{ color: ColorsApp.primaryTextColor }}
          onChangeText={(text) => setNombreCaracteristica(text)}
          cursorColor={ColorsApp.primaryColor}
          value={nombreCaracteristica}
        />
        <PrimaryButton title="Agregar" actionFunction={validations} />
      </View>
      {alerta()}
    </View>
  );
};
export default NewFeatureAdminScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    width: "75%",
    margin: 10,
  },
});
