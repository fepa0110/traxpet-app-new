import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
  } from "react-native";
  import React, { useState,useEffect } from "react";
  import { Header, } from "@rneui/themed";
  import { ColorsApp } from "../constants/Colors";
  import { useNavigation } from "@react-navigation/native";
  import AwesomeAlert from "react-native-awesome-alerts";
  import { Entypo ,Ionicons} from "@expo/vector-icons";
  import { getEspecies ,disabledEspecie,sendFeatures} from "../services/SpecieService";

  const NewSpecieAdminScreen = () => {
    const navigation = useNavigation();
    const [nombreEspecie, setNombreEspecie] = useState("");
    const [especieValues, setEspecieValues] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [especieExist, setEspecieExist] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
  
  })
  const getEspeciesData = async () => {
    const data = await getEspecies() ;
    setEspecieValues(data);

  };
  
  const validateFeature = () => {
      getEspeciesData();
      setEspecieExist (false);
      especieValues.map((especies) => {
        if (
          Object.is(
            especies.nombre.toUpperCase().trim(),
            nombreEspecie.toUpperCase().trim()
          )
        ) {
          setEspecieExist (true);
      }
      });
    };
    const sendFeaturesData = (data) => {
      sendFeatures(data);
    };
  
   const showAlerts = (title, messsage) => {
      
        setShowAlert(true),
        setAlertTitle(title),
        setAlertMessage( messsage)
      
    };
    const hideAlert = () => {
    
        setShowAlert(false)
     
    };
  
    const validations = () => {
     validateFeature();
      if (nombreEspecie.trim().length === 0) {
          showAlerts(
          "Error",
          "El campo nombre de especie no puede estar vacio"
        );
      } else if (nombreEspecie.length > 50) {
          showAlerts(
          "Error",
          "El campo nombre de especie no puede superar los 50 caracteres"
        );
      } else if (especieExist) {
          showAlerts(
          "Error",
          "Ya existe la especie: " + nombreEspecie
        );
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
      <View>
        <Header
          containerStyle={{
            backgroundColor: ColorsApp.primaryColor,
            justifyContent: "space-around",
            height: 65,
          }}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={24} color={ColorsApp.secondaryColor}/>
            </TouchableOpacity>
          }
          centerComponent={{
            text: "Menu de administracion",
            style: {
              fontSize: 18,
              color: ColorsApp.secondaryColor,
              fontWeight: "bold",
            },
          }}
          rightComponent={{}}
        />
        <View style={styles.container}>
          <View>
            <View style={styles.viewOptionsContainer}>
              <Text
                style={{ fontWeight: "bold", fontSize: 16, paddingBottom: 5 }}
              >
                Nombre de especie
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setNombreEspecie(text)}
                value={nombreEspecie}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => {
                validations();
              }}
            >
  
  
              <Text style={{
                  color:ColorsApp.secondaryColor}}
              >Agregar</Text>
            
              <Ionicons name="add-outline" size={34}  color={ColorsApp.secondaryColor}/>
            </TouchableOpacity>
          </View>
        </View>
        {alerta()}
      </View>
    );
  };
  
  export default NewSpecieAdminScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center",
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
    buttonBack: {
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
  