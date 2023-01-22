import {
    StyleSheet,
    Text,
    View, 
    TextInput,
    TouchableOpacity,
  } from "react-native";

  import { urlServer } from "../constants/constants";
  import { useNavigation } from "@react-navigation/native";
  import { ColorsApp } from "../constants/Colors";
  import React, { useState, useEffect } from "react";
  import AwesomeAlert from "react-native-awesome-alerts";
  
  import Header from "../components/Header";
  import { Input } from "@rneui/themed";
  import PrimaryButton from "../components/PrimaryButton";

  const NewFeatureAdminScreen = () => {
    const navigation = useNavigation();
  
    const [nombreCaracteristica, setNombreCaracteristica] = useState("");
    const [featuresValues, setFeaturesValues] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [featureExist, setFeatureExist] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
  
    const getFeaturesData = () => {
      fetch(urlServer + "/caracteristicas")
        .then((response) => response.json())
        .then((json) => {
          setFeaturesValues(json.data);
        });
    };
  
    useEffect(() => {
      getFeaturesData();
    });
    const validateFeature = () => {
      setFeatureExist(false);
      featuresValues.map((caracteristicas) => {
        if (
          Object.is(
            caracteristicas.nombre.toUpperCase().trim(),
            nombreCaracteristica.toUpperCase().trim()
          )
        ) {
          setFeatureExist(true);
        }
      });
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
      } else if (featureExist) {
        showAlerts(
          "Error",
          "Ya existe la caracteristica: " + nombreCaracteristica
        );
      } else {
        sendFeaturesData({
          nombre: nombreCaracteristica.trim(),
        });
        navigation.navigate("FeaturesAdminScreen");
      }
    };
    const sendFeaturesData = (data) => {
      fetch(urlServer + "/caracteristicas", {
        method: "POST", // or 'PUT'
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error))
        .then((response) => console.log("Success:", response));
    };
    const showAlerts = (title, messsage) => {
      
      setShowAlert(true),
      setAlertTitle(title),
      setAlertMessage( messsage)
    
  };
  const hideAlert = () => {
  
      setShowAlert(false)
   
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
          confirmButtonColor={ColorsApp.secondaryColor}
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
            labelStyle={{color: ColorsApp.primaryTextColor }}
            inputStyle={{ color: ColorsApp.primaryTextColor }}
            inputContainerStyle={{color: ColorsApp.primaryTextColor }}
            containerStyle={{color: ColorsApp.primaryTextColor}}
            onChangeText={(text) => setNombreCaracteristica(text)}
            value={nombreCaracteristica}
          />
          <PrimaryButton
            title="Agregar"
            actionFunction={() => {
              validateFeature();
            }}
          />
        </View>
        {alerta()}
      </View>
    );
  };
  
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
  export default NewFeatureAdminScreen;
  