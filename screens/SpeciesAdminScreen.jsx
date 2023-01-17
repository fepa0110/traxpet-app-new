import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";

import { Divider } from "@rneui/themed";

import {
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ScrollView,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";

import Header from "../components/Header";
import { ColorsApp } from "../constants/Colors";
import { getEspecies, disableEspecieRequest } from "../services/SpecieService";
import FloatingButton from "../components/FloatingButton";
import Separator from "../components/Separator";

const SpeciesAdminScreen = () => {

  const navigation = useNavigation();
  const [especieValues, setEspecieValues] = useState([]);
  const [especieSeleccionada, setEspecieSeleccionada] = useState([]);
  const [showAlertConfirm, setShowAlertConfirm] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    getEspeciesData();
  }, []);

  const getEspeciesData = async () => {
    const especies = await getEspecies() ;

    console.log(especies.data);
    setEspecieValues(especies.data);

  };
  const disableEspecie = async () => {
    await disableEspecieRequest(especieSeleccionada);
    setEspecieSeleccionada("");
    getEspeciesData();
  };
  
  const showAlertConfirms = (title, messsage) => {
        setShowAlertConfirm(true),
        setAlertTitle (title),
        setAlertMessage( messsage)
  };
    
  const  hideAlertConfirms = () => {
    setShowAlertConfirm( false);
  };

  const listEmpty = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          No hay especies
        </Text>
        <FontAwesome5 name="frown-open" size={32} color={ColorsApp.primaryColor} />
      </View>
    );
  };

  const itemDivider = () => {
    return(
      <View style={{alignItems: "center", height: "100%" }}>
        <Separator width="50%"/>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={{
      flexDirection:"row", 
      alignItems: "center",
      justifyContent:"space-between",
    }}>
      <View style={{
          marginHorizontal: 20, 
          flexDirection: "row",
          alignItems: "center"
      }}
      >
          <FontAwesome5
            name="angle-right"
            size={20}
            color={ColorsApp.primaryColor}
          />
          <Text style={styles.itemTitle}>
            {!item.deshabilitado ?
            item.nombre : item.nombre + " (deshabilitado)"}
          </Text>
          
      </View>

      <View style={{ flexDirection: "row"}}>
          <TouchableOpacity
            style={styles.buttonEdit}
            onPress={() => navigation.navigate
              ("EditSpecieAdminScreen", {
                especie: item.nombre,
              })
            }
          >
            <FontAwesome5 name="pencil-alt" size={20} color={ColorsApp.primaryColor} />
          </TouchableOpacity>

          {!item.deshabilitado ? (
            <TouchableOpacity
              style={styles.buttonEdit}
              onPress={() => {
                setEspecieSeleccionada(item.nombre);

                showAlertConfirms(
                  "Confirmar cambios",
                  "¿Quiere confirmar los cambios realizados?",
                );
              }}
            >
              <FontAwesome5 
                name="trash-alt" 
                size={20} 
                color={ColorsApp.primaryColor}
              />
            </TouchableOpacity>
            ) : (
            <View style={{ paddingEnd: 4, alignItems: "center" }}>
            </View>
          )}
      </View>
    </View>
  );

  const alerta = () => {
    return (
      <AwesomeAlert
        show={showAlertConfirm}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        cancelText="Cancelar"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Aceptar"
        confirmButtonColor={ColorsApp.primaryColor}
        cancelButtonColor={ColorsApp.secondaryColor}
        confirmButtonStyle={{ 
          borderColor: ColorsApp.primaryColor, borderWidth: 1 
        }}
        cancelButtonStyle={{ 
          borderColor: ColorsApp.primaryColor, 
          borderWidth: 1,
          fontWeight: "bold"
        }}
        cancelButtonTextStyle={{ color: ColorsApp.primaryColor,}}
        onConfirmPressed={async () => {
          await disableEspecie();
          setShowAlertConfirm(false);
        }}
        onCancelPressed={() => {
          setShowAlertConfirm(false);
        }}
      />
    );
  };

  return (
    // TODO: Funcionalidad del boton remover
    <View style={{ height: "100%" }} >
    <Header title="Especies"/>
      <ScrollView style={styles.container}>
        <FlashList
          contentContainerStyle={{ paddingVertical: 20 }}
          data={especieValues}
          renderItem={renderItem}
          estimatedItemSize={10}
          ListEmptyComponent={listEmpty}
          ItemSeparatorComponent={itemDivider}
        />
        </ScrollView>
      <FloatingButton
        visible={true}
        onPressFunction={() => {
          navigation.navigate("NewSpecieAdminScreen")
        }}
      />
      {alerta()}
    </View>
  );
};

export default SpeciesAdminScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    height:"100%",
    width: "75%",
    alignSelf: "center"
  },
  item: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderColor: ColorsApp.primaryColor,
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
    width: 300,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 20,
  },
  button: {
    backgroundColor: ColorsApp.primaryColor,
    borderRadius: 55,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
    margin: 8,
  },
  buttonEdit: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    borderRadius: 55,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
    marginLeft: 2,
    marginRight: 2,
  },
  message: { 
    fontWeight: "bold", 
    fontSize: 16, 
    padding: 5
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal:10
  },
});
