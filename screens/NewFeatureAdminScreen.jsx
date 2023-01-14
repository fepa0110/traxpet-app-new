import {
    StyleSheet,
    Text,
    View, 
    TextInput,
    TouchableOpacity,
  } from "react-native";
  import { urlServer } from "../constants/constants";
  import { useNavigation } from "@react-navigation/native";
  import { Entypo ,Ionicons} from '@expo/vector-icons'; 
  import { Header } from "@rneui/themed";
  import { ColorsApp } from "../constants/Colors";
  import React, { useState, useEffect } from "react";
  import AwesomeAlert from "react-native-awesome-alerts";
  
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
      <View>
        <Header
          containerStyle={{
            backgroundColor: ColorsApp.primaryColor,
            justifyContent: "space-around",
            height: 65,
          }}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo
                name="chevron-left"
                size={24}
                export
                default
                FeaturesAdminScreen
                color={ColorsApp.secondaryColor}
                style={{ paddingRight: 5 }}
              />
            </TouchableOpacity>
          }
          centerComponent={{
            text: "Nueva caracteristica",
            style: {
              fontSize: 18,
              color: ColorsApp.secondaryColor,
              fontWeight: "bold",
            },
          }}
          rightComponent={{}}
        />
        <View style={styles.container}>
          <View style={styles.viewOptionsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 16, paddingBottom: 5 }}>
              Nombre de caracteristica
            </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setNombreCaracteristica(text)}
              value={nombreCaracteristica}
            />
          </View>
  
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonAcept}
              onPress={() => {
                validateFeature();
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
                    "Ya existe la caracteristica: " +
                      nombreCaracteristica
                  );
                } else {
                  sendFeaturesData({
                    nombre: nombreCaracteristica.trim(),
                  });
                  navigation.navigate("FeaturesAdminScreen");
                }
              }}
            >
              <Text
                style={{
                  color: ColorsApp.secondaryColor,
                }}
              >
                Agregar
              </Text>
              <Ionicons
                name="add-outline"
                size={34}
                color={ColorsApp.secondaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        {alerta()}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ColorsApp.primaryBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
    },
    viewOptionsContainer: {
      alignItems: "center",
      padding: 10,
    },
    textInput: {
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
      height: 40,
      width: 250,
      borderColor: "gray",
      borderWidth: 1,
    },
    buttonContainer: {
      flex: 1,
      bottom: 10,
      justifyContent: "center",
      paddingBottom: 20,
      flexDirection: "row",
      paddingLeft: 10,
      paddingRight: 20,
    },
  
    buttonText: {
      backgroundColor: ColorsApp.primaryColor,
      alignItems: "center",
      justifyContent: "center",
      width: 205,
      height: 45,
      flexDirection: "row",
      margin: 10,
    },
    buttonAcept: {
      backgroundColor: ColorsApp.primaryColor,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "flex-end",
      width: 115,
      height: 40,
      flexDirection: "row-reverse",
      borderRadius: 50,
      marginTop: 100,
    },
    buttonView: {
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
  });
  export default NewFeatureAdminScreen;
  