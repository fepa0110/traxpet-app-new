import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";

import { ColorsApp } from "constants/Colors";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import { getEspecies, sendSpecie } from "services/SpecieService";
import Header from "@/Header";
import { Input } from "@rneui/themed";
import PrimaryButton from "@/PrimaryButton";

const NewSpecieAdminScreen = () => {
  const navigation = useNavigation();
  const [nombreEspecie, setNombreEspecie] = useState("");
  const [especieValues, setEspecieValues] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const sendSpecieData = (data) => {
    sendSpecie(data);
  };

  const showAlerts = (title, messsage) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertMessage(messsage);
  };
  const hideAlert = () => {
    setShowAlert(false);
  };

  const validations = async () => {
    const especies = await getEspecies();
    const especieExistente = especies.data.find(
      (especie) =>
        especie.nombre.toUpperCase().trim() ===
        nombreEspecie.toUpperCase().trim()
    );

    if (nombreEspecie.trim().length == 0) {
      showAlerts("Error", "El campo nombre de especie no puede estar vacio");
    } else if (nombreEspecie.length > 50) {
      showAlerts(
        "Error",
        "El campo nombre de especie no puede superar los 50 caracteres"
      );
    } else if (especieExistente != undefined) {
      showAlerts("Error", "Ya existe la especie: " + nombreEspecie);
    } else {
      sendSpecieData({
        nombre: nombreEspecie.trim(),
      });
      navigation.goBack();
    }
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
      <Header title="Nueva especie" />
      <View style={styles.container}>
        <Input
          label="Nombre de especie"
          placeholder="Conejo"
          labelStyle={{ color: ColorsApp.primaryTextColor }}
          inputStyle={{ color: ColorsApp.primaryTextColor }}
          inputContainerStyle={{ color: ColorsApp.primaryTextColor }}
          containerStyle={{ color: ColorsApp.primaryTextColor }}
          onChangeText={(nombreEspecie) => setNombreEspecie(nombreEspecie)}
          cursorColor={ColorsApp.primaryColor}
          value={nombreEspecie}
        />
        <PrimaryButton title="Agregar" actionFunction={validations} />
      </View>
      {alerta()}
    </View>
  );
};

export default NewSpecieAdminScreen;

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
