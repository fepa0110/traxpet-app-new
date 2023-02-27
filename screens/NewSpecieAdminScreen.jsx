import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";

import { ColorsApp } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  getEspecies,
  disabledEspecie,
  sendFeatures,
} from "../services/SpecieService";
import Header from "../components/Header";
import { Input } from "@rneui/themed";
import PrimaryButton from "../components/PrimaryButton";

const NewSpecieAdminScreen = () => {
  const navigation = useNavigation();
  const [nombreEspecie, setNombreEspecie] = useState("");
  const [especieValues, setEspecieValues] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [especieExist, setEspecieExist] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {});
  const getEspeciesData = async () => {
    const data = await getEspecies();
    setEspecieValues(data);
  };

  const validateFeature = () => {
    getEspeciesData();
    setEspecieExist(false);
    especieValues.map((especies) => {
      if (
        Object.is(
          especies.nombre.toUpperCase().trim(),
          nombreEspecie.toUpperCase().trim()
        )
      ) {
        setEspecieExist(true);
      }
    });
  };

  const sendFeaturesData = (data) => {
    sendFeatures(data);
  };

  const showAlerts = (title, messsage) => {
    setShowAlert(true), setAlertTitle(title), setAlertMessage(messsage);
  };
  const hideAlert = () => {
    setShowAlert(false);
  };

  const validations = () => {
    validateFeature();
    if (nombreEspecie.trim().length === 0) {
      showAlerts("Error", "El campo nombre de especie no puede estar vacio");
    } else if (nombreEspecie.length > 50) {
      showAlerts(
        "Error",
        "El campo nombre de especie no puede superar los 50 caracteres"
      );
    } else if (especieExist) {
      showAlerts("Error", "Ya existe la especie: " + nombreEspecie);
    } else {
      sendFeaturesData({
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
        confirmButtonColor="orangered"
        onConfirmPressed={() => {
          hideAlert();
        }}
      />
    );
  };
  return (
    <View style={{width: "100%"}}>
      <Header title="Nueva especie" />
      <View style={styles.container}>
        <Input
          label="Nombre de especie"
          placeholder="Conejo"
          labelStyle={{color: ColorsApp.primaryTextColor }}
          inputStyle={{ color: ColorsApp.primaryTextColor }}
          inputContainerStyle={{color: ColorsApp.primaryTextColor }}
          containerStyle={{color: ColorsApp.primaryTextColor}}
          onChangeText={(text) => setNombreEspecie(text)}
          cursorColor={ColorsApp.primaryColor}
          value={nombreEspecie}
        />
        <PrimaryButton
          title="Agregar"
          actionFunction={() => {
            validations();
          }}
        />
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
    margin: 10
  }
});
