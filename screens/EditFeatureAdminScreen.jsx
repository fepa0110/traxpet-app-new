import React, { useState, useEffect } from "react";

import { FontAwesome5 } from "@expo/vector-icons";

import { FlashList } from "@shopify/flash-list";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import AwesomeAlert from "react-native-awesome-alerts";

import {
  saveValor,
  getValuesDataByFeatureAndSpecie,
  disabledValue,
} from "services/ValoresService";

import { Input } from "@rneui/themed";

import { ColorsApp } from "constants/Colors";
import Header from "@/Header";
import Separator from "@/Separator";
import PrimaryButton from "@/PrimaryButton";
import IconButton from "@/IconButton";

const EditFeatureAdminScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { especie, caracteristica } = route.params;

  const [nombreValor, setNombreValor] = useState("");
  const [values, setValues] = useState([]);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertConfirm, setShowAlertConfirm] = useState(false);
  const [valorExist, setValorExist] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [saveAlert, setSaveAlert] = useState(false);
  const [valuesToSave, setValuesToSave] = useState([]);
  const [valuesToDisable, setValuesToDisable] = useState([]);

  useEffect(() => {
    getValuesDataByFeatureAndSpecieAsync();
  }, []);

  const getValuesDataByFeatureAndSpecieAsync = async () => {
    const response = await getValuesDataByFeatureAndSpecie(
      especie.nombre,
      caracteristica
    );

    setValues(response.data);
  };

  const showAlertErrors = (messsage) => {
    setShowAlertError(true), setAlertMessage(messsage);
  };

  const showAlertConfirms = (title, messsage) => {
    setShowAlertConfirm(true), setAlertTitle(title), setAlertMessage(messsage);
  };

  const hideAlert = () => {
    setShowAlertError(false), setSaveAlert(false), setShowAlertConfirm(false);
  };

  const saveValue = async (data) => {
    console.log("🚀 saveValue ~ data:", data);
    
    await saveValor(data);
  };

  const disableValue = async (data) => {
    await disabledValue(data);
  };

  const valueExistValidate = () => {
    setValorExist(false);
    values.map((valores) => {
      if (
        Object.is(
          valores.nombre.toUpperCase().trim(),
          nombreValor.toUpperCase().trim()
        )
      ) {
        setValorExist(true);
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
      console.log("🚀 ~ caracteristica:", caracteristica);
      
      let value = {
        nombre: nombreValor,
        especie: {"nombre":especie.nombre},
        caracteristica: { "nombre": caracteristica },
      };
      values.push(value);
      valuesToSave.push(value);

      setValues(values.slice(0));
    }
    setNombreValor("");
  };

  const removeItem = (value) => {
    if (valuesToSave.some((valor) => valor.nombre === value)) {
      setValuesToSave(valuesToSave.filter((el) => el.nombre != value));
      setValues(values.filter((el) => el.nombre != value));

      setValues(values.slice(0));
    } else {
      let posicion = values
        .map(function (e) {
          return e.nombre;
        })
        .indexOf(value);
      valuesToDisable.push(values[posicion]);
      values[posicion].deshabilitado = true;
      setValues(values.slice(0));
    }
  };

  let saveChanges = () => {
    setSaveAlert(true);
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
        confirmButtonColor={ColorsApp.primaryColor}
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
        confirmButtonColor={ColorsApp.primaryColor}
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

  const renderItem = ({ item }) =>
    !item.deshabilitado ? (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome5
            name="angle-right"
            size={20}
            color={ColorsApp.primaryColor}
          />
          <Text style={styles.itemTitle}>{item.nombre}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              removeItem(item.nombre);
            }}
          >
            <FontAwesome5
              name="trash-alt"
              size={20}
              color={ColorsApp.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome5
            name="angle-right"
            size={20}
            color={ColorsApp.primaryColor}
          />
          <Text style={styles.itemTitle}>
            {item.nombre + " (Deshabilitado)"}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity disabled={true}>
            <FontAwesome5
              name="power-off"
              size={20}
              color={ColorsApp.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  
  const listEmpty = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No hay valores</Text>
        <FontAwesome5
          name="frown-open"
          size={32}
          color={ColorsApp.primaryColor}
        />
      </View>
    );
  };

  const itemDivider = () => {
    return (
      <View style={{ alignItems: "center", height: "100%" }}>
        <Separator width="50%" />
      </View>
    );
  };

  return (
    <View style={{height: "100%"}}>
      <Header title="Nuevo valor" />
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", fontSize: 22, margin: 5 }}>
          Especie: {especie.nombre}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 16, margin: 5 }}>
          Caracteristica: {caracteristica}
        </Text>
        <ScrollView style={styles.scrollView}>
          <FlashList
            contentContainerStyle={{ paddingVertical: 20 }}
            data={values}
            renderItem={renderItem}
            estimatedItemSize={10}
            ListEmptyComponent={listEmpty}
            ItemSeparatorComponent={itemDivider}
          />
        </ScrollView>
        <View style={styles.inputView}>
          <Input
            label="Agregar Valor"
            placeholder="Pelaje"
            labelStyle={{color: ColorsApp.primaryTextColor }}
            inputStyle={{ color: ColorsApp.primaryTextColor }}
            inputContainerStyle={{color: ColorsApp.primaryTextColor }}
            containerStyle={{color: ColorsApp.primaryTextColor}}
            cursorColor={ColorsApp.primaryColor}
            onChangeText={(text) => setNombreValor(text)}
            value={nombreValor}
          />
          <IconButton
            onPressFunction={() => {
              refreshScreen();
            }}
            iconName="plus"
            size={45}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Guardar"
            actionFunction={() => {
              saveChanges();
            }}
          />
        </View>
      </View>
      {alertError()}
      {alertConfirm()}
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
  item: {
    backgroundColor: "white",
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
  buttonContainer: {
    justifyContent: "center",
    paddingBottom: 10,
    flexDirection: "row",
  },

  inputView: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    width: "75%",
    height: 40,
    marginTop: 20,
    marginBottom: 20,
  },

  scrollView: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    height: "100%",
    width: "75%",
    alignSelf: "center",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: ColorsApp.primaryTextColor
  },
});

export default EditFeatureAdminScreen;
