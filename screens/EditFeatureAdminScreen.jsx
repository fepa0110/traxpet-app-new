import React, { useState, useEffect } from "react";
import { urlServer } from "../constants/constants";

import { FontAwesome5 } from "@expo/vector-icons";

import { FlashList } from "@shopify/flash-list";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import AwesomeAlert from "react-native-awesome-alerts";

import {
  saveValor,
  getValuesDataByFeatureAndSpecie,
  disabledValue,
} from "../services/ValoresService";

import { Input } from "@rneui/themed";

import { ColorsApp } from "../constants/Colors";
import Header from "../components/Header";
import Separator from "../components/Separator";
import PrimaryButton from "../components/PrimaryButton";
import IconButton from "../components/IconButton";

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
    console.log("Caracteristica " + caracteristica);
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
    await fetch(saveValor(data));
  };

  const disableValue = async (data) => {
    await fetch(disabledValue(data));
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
      let value = {
        nombre: nombreValor,
        especie: especie.nombre,
        caracteristica: { caracteristica },
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
      console.log(valuesToDisable);
      values[posicion].deshabilitado = true;
      setValues(values.slice(0));
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
      <Header title="Nueva caracteristica" />
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
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Agregar valor
        </Text>
        <View style={styles.pickerView}>
          <Input
            style={styles.textInput}
            label="Caracteristica"
            placeholder="Pelaje"
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
              setSaveAlert(true);
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
    backgroundColor: "#fff",
    alignItems: "center",
  },
  viewOptionsContainer: {
    alignItems: "center",
    padding: 10,
  },
  textInput: {
    // alignItems: "center",
    // alignContent: "center",
    // justifyContent: "center",
    height: 40,
    width: 250,
    // borderColor: "gray",
    // borderWidth: 1,
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
  },
});

export default EditFeatureAdminScreen;
