import React, { useState, useEffect } from "react";
import { urlServer } from "../constants/constants";
import { Header, Icon } from "@rneui/themed";
import { ColorsApp } from "../constants/Colors";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,TextInput
} from "react-native";
import { useNavigation ,useRoute} from "@react-navigation/native";
import { MaterialIcons,Ionicons} from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";



const EditFeatureAdminScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [nombreValor, setNombreValor] = useState("")        
    const [values, setValues] = useState([])
    const [showAlertError, setShowAlertError] = useState(false)
    const [showAlertConfirm, setShowAlertConfirm] = useState(false)
    const [valorExist, setValorExist] = useState(false)
    const [alertTitle, setAlertTitle] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    const [saveAlert, setSaveAlert] = useState(false)
    const [valuesToSave, setValuesToSave] = useState([])
    const [valuesToDisable, setValuesToDisable] = useState([])
    const { caracteristica } = useState(route.params.EditSpecieAdminScreen);
    const { mascota } = useState(route.params.EditSpecieAdminScreen);

      
    
    useEffect(() => {
      getValuesDataByFeatureAndSpecieAsync();

    }, []);
    
  
    const getValuesDataByFeatureAndSpecieAsync = async () => {
      // variables
        
      //Request Valores en la BD
      const response = await fetch(
        urlServer +
          "/valores/allByEspecieYCaracteristica?especieNombre=" +
          mascota +
          "&&caracteristicaNombre=" +
          caracteristica
      );
      const resJson = await response.json();
 
      setValues(resJson.data)
    };
  
    const showAlertErrors = (messsage) => {
   
        setShowAlertError(true),
        setAlertMessage( messsage)
    };
  
   const showAlertConfirms = (title, messsage) => {
    
        setShowAlertConfirm( true),
        setAlertTitle(title),
        setAlertMessage(messsage) 
         };
  
   const hideAlert = () => {
        setShowAlertError(false),
        setSaveAlert(false),
        setShowAlertConfirm(false)
    };
  
    const saveValue = async (data) => {
      await fetch(urlServer + "/valores", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    };
  
    const disableValue = async (data) => {
      await fetch(urlServer + "/valores", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
        .then((response) => response.json())
        .catch((error) => console.log(error))
        .then((json) => {
          console.log(json);
        });
    };
  
    const valueExistValidate = () => {
      setValorExist = false;
      values.map((valores) => {
        if (
          Object.is(
            valores.nombre.toUpperCase().trim(),
            nombreValor.toUpperCase().trim()
          )
        ) {
          setValorExist( true)
        }
      });
    };
  
    const refreshScreen = () => {
      valueExistValidate();
      if (nombreValor.trim().length === 0) {
        showAlertErrors(`El nombre del valor no puede estar vacio`);
      } else if (valorExist) {
        showAlertErrors("El valor ingresado ya existe");
      } else {
        let value = {
          nombre: nombreValor,
          especie: { especie },
          caracteristica: { caracteristica },
        };
        values.push(value);
        valuesToSave.push(value);
        
          setValues(values.slice(0))
        
      }
      setNombreValor ("");
    };
  
   const removeItem = (value) => {
      
      if (valuesToSave.some((valor) => valor.nombre === value)) {
        setValuesToSave(valuesToSave.filter(
          (el) => el.nombre != value
        ));
        setValues(values.filter((el) => el.nombre != value));
        
        setValues(values.slice(0))
      }
      else {
        let posicion = values
          .map(function (e) {
            return e.nombre;
          })
          .indexOf(value);
        valuesToDisable.push(values[posicion]);
        console.log(valuesToDisable);
        values[posicion].deshabilitado = true;
        setValues(values.slice(0))

      }
    };
  
    
      let saveChanges = () => {
        const sendValues = valuesToSave;
        const toDisableValues = valuesToDisable;
        if (
          (sendValues != undefined && sendValues.length != 0) ||
          (toDisableValues != undefined && toDisableValues.length != 0)
        ) {
          showAlertConfirms(
            "Confirmar cambios",
            "¿Quiere confirmar los cambios realizados?"
          );
        } else {
          navigation.goBack();
        }
      };
  
      let goToPrevScreen = () => {
        const sendValues = valuesToSave;
        const toDisableValues = valuesToDisable;
        console.log(toDisableValues);
        if (
          (sendValues != undefined && sendValues.length != 0) ||
          (toDisableValues != undefined && toDisableValues.length != 0)
        ) {
          showAlertConfirms(
            "Confirmar retroceso",
            "¿Quiere volver a la pantalla anterior sin realizar cambios?"
          );
        } else {
          navigation.goBack();
        }
      };
  
      let alertError = () => {
        return (
          <AwesomeAlert
            show={showAlertError}
            showProgress={false}
            title="Error"
            message={alertMessage}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Aceptar"
            confirmButtonColor="orangered"
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
        );
      };
  
      let alertConfirm = () => {
        return (
          <AwesomeAlert
            show={showAlertConfirm}
            showProgress={false}
            title={alertTitle}
            message={alertMessage}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            showCancelButton={true}
            cancelText="No"
            confirmText="Si"
            confirmButtonColor="orangered"
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              if (saveAlert) {
                valuesToSave.map((valor) => {
                  saveValue(valor);
                });
                valuesToDisable.map((valor) => {
                disableValue(valor);
                });
               hideAlert();
              }
             navigation.goBack();
            }}
          />
        );
      };
  
      let Item = ({ title }) => {
        if (!title.deshabilitado) {
          return (
            <View style={styles.item}>
              <Text >
                {title.nombre}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  onPress={() => {
                    removeItem(title.nombre);
                  }}
                >
                  <Icon name="trash" size={25} color={ColorsApp.terciaryColor} />
                </TouchableOpacity>
              </View>
            </View>
          );
        } else {
          return (
            <View style={styles.item}>
              <Text style>
                {title.nombre + "   (Deshabilitado)"}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity style={styles.buttonEdit}>
                  <Icon name="power-sharp" size={25} color={ColorsApp.terciaryColor} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      };
  
      let renderItem = ({ item }) => {
        return <Item title={item} />;
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
              <TouchableOpacity
         
                onPress={goToPrevScreen}
              >
                <Icon
                  style={{ paddingRight: 5 }}
                  name="chevron-back-sharp"
                  size={25}
                  color={ColorsApp.secondaryColor}
                />
              </TouchableOpacity>
            }
            centerComponent={{
              text: "Nueva caracteristica",
              style: { fontSize: 18, color: ColorsApp.secondaryColor, fontWeight: "bold" },
            }}
            rightComponent={{}}
          />
          <View style={styles.container}>
            <Text style={{ fontWeight: "bold", fontSize: 22, margin: 5 }}>
              Especie: {mascota}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 16, margin: 5 }}>
              Caracteristica: {caracteristica}
            </Text>
            <FlatList
              data={values}
              renderItem={renderItem}
              keyExtractor={(item) => item.nombre}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Agregar valor
            </Text>
            <View style={ styles.pickerView}>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) =>  setNombreValor(text) }
                value={nombreValor}
              />
              <TouchableOpacity
                style={ styles.button}
                onPress={() => {
                  refreshScreen();
                }}
              >
                <Ionicons name="add-sharp" size={40} color={ColorsApp.secondaryColor}/>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={ styles.buttonSave}
                onPress={() => {
                  setSaveAlert(true);
                  saveChanges();
                }}
              >
                <Text style> Guardar</Text>
                <View style>
                <MaterialIcons name="save" size={25} color={ColorsApp.secondaryColor}  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {alertError()}
          {alertConfirm()}
        </View>
      );
    
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
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
    buttonText: {
      backgroundColor: "orangered",
      alignItems: "center",
      justifyContent: "center",
      width: 205,
      height: 45,
      flexDirection: "row",
      margin: 10,
    },
    item: {
      backgroundColor: "white",
      borderBottomRightRadius: 25,
      borderTopLeftRadius: 25,
      borderColor: "orangered",
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "space-between",
      width: 350,
      height: 45,
      flexDirection: "row",
      paddingLeft: 8,
      marginTop: 5,
      marginBottom: 5,
    },
    itemDisable: {
      backgroundColor: "orangered",
      borderBottomRightRadius: 25,
      borderTopLeftRadius: 25,
      borderColor: "black",
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "space-between",
      width: 350,
      height: 45,
      flexDirection: "row",
      paddingLeft: 8,
      marginTop: 5,
      marginBottom: 5,
    },
    title: {
      fontSize: 32,
    },
    buttonContainer: {
      justifyContent: "flex-end",
      paddingBottom: 10,
      flexDirection: "row",
    },
    button: {
      backgroundColor: ColorsApp.terciaryColor,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row-reverse",
      width: 45,
      height: 45,
    },
    buttonEdit: {
      backgroundColor: "white",
      borderRadius: 55,
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      width: 35,
      height: 35,
      marginLeft: 2,
      marginRight: 2,
    },
    buttonBack: {
      backgroundColor: "orangered",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "flex-end",
      width: 115,
      height: 40,
      flexDirection: "row-reverse",
      borderRadius: 50,
      margin: 10,
    },
  
    buttonSave: {
      backgroundColor: "orangered",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "flex-end",
      width: 115,
      height: 40,
      flexDirection: "row-reverse",
      borderRadius: 50,
      margin: 10,
    },
    pickerView: {
      alignItems: "center",
      alignContent: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      width: 300,
      height: 40,
      marginTop: 20,
    },
  });
    

export default EditFeatureAdminScreen;
