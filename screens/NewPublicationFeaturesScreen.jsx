import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ColorsApp } from "../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";
import TraxpetHeader from "../components/Header";

import { useSelector, useDispatch } from "react-redux";
import { setNewPublication } from "../redux/slices/publicationSlice";
import { getFeaturesBySpecieName } from "../services/FeatureService";

import LoadingIndicator from "../components/LoadingIndicator";
import LargePrimaryButton from "../components/LargePrimaryButton";
import { Divider } from "@rneui/themed";

const NewPublicationFeaturesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const publicacion = useSelector((state) => state.newPublication).publication;

  const [featuresValues, setFeaturesValues] = useState([]);
  const [selectedFeaturesValues, setselectedFeaturesValues] = useState(
    new Map()
  );
  const [selectedFeatureValue, setselectedFeatureValue] = useState([]);
  useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const getFeaturesData = async () => {
    let featuresData = await getFeaturesBySpecieName(
      publicacion.mascota.especie.nombre
    );
    setIsLoading(false);
    setFeaturesValues(featuresData);
  };
  useEffect(() => {
    getFeaturesData();
  }, []);

  const generatePublicationJson = () => {
    let valuesSelected = [];
    let publicacionAux = {};

    for (let [nameValue, nameFeature] of selectedFeaturesValues) {
      if (nameFeature !== "Seleccionar") {
        valuesSelected.push({
          nombre: nameValue,
          caracteristica: {
            nombre: nameFeature,
          },
        });
      }
    }

    publicacionAux = {
      tipoPublicacion: publicacion.tipoPublicacion,
      usuario: {
        username: user.username,
      },
      ubication: location,
      mascota: {
        especie: publicacion.mascota.especie,
        nombre: publicacion.mascota.nombre,
        valores: valuesSelected,
      },
    };
    dispatch(setNewPublication(publicacionAux));
  };

  const alerta = () => {
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Aceptar"
        confirmButtonColor={ColorsApp.primaryColor}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    );
  };

  const featuresOptions = (feature) => {
    let options = [];
    selectedFeaturesValues.set(feature.nombre, "Seleccionar");
    options.push(
      <Picker.Item
        label="Seleccionar"
        value="Seleccionar"
        key={feature.nombre + "ValueDefault"}
      />
    );
    feature.valores.map((value, index) => {
      options.push(
        <Picker.Item label={value.nombre} value={value.nombre} key={index} />
      );
    });
    return options;
  };

  const featuresPickers = featuresValues.map((feature, index) => {
    return (
      <View key={"ViewPicker" + index} style={styles.viewOptionsContainer}>
        <Text style={styles.textTitle}>{feature.nombre}</Text>
        <View style={styles.pickerView}>
          <Picker
            multiple={false}
            selectedValue={selectedFeatureValue[index]}
            onValueChange={(value) => {
              selectedFeaturesValues.set(feature.nombre, value);
            }}
            mode="dropdown"
            style={{ width: 250, height: 50, fontSize: 22 }}
            key={"picker" + index}
          >
            {featuresOptions(feature)}
          </Picker>
        </View>
      </View>
    );
  });

  const featuresView = () => {
    return (
      <ScrollView style={{ marginTop: 25, marginBottom: 25 }}>
        {featuresPickers}
        <View style={styles.buttonContainer}>
          <Divider
            orientation="horizontal"
            color="#AAA"
            width={1}
            style={{ width: 150, marginVertical: 15 }}
          />
          <LargePrimaryButton
            title="Publicar"
            actionFunction={() => {
              generatePublicationJson();
              navigation.navigate("SimilarPetScreen");
            }}
            disabled={false}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: ColorsApp.primaryBackgroundColor }}>
      <TraxpetHeader title="Caracteristicas" />
      {isLoading ? <LoadingIndicator /> : featuresView()}
      {alerta()}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  viewOptionsContainer: {
    alignItems: "center",
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  buttonPublicar: {
    backgroundColor: ColorsApp.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    width: 115,
    height: 40,
    flexDirection: "row-reverse",
    borderRadius: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  pickerView: {
    alignItems: "center",
    width: 250,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
    resizeMode: "contain",
    marginBottom: 5,
  },
  textTitle: { fontWeight: "bold", fontSize: 16, paddingBottom: 5 },
});

export default NewPublicationFeaturesScreen;
