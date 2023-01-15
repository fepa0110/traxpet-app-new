import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import TraxpetHeader from "../components/Header";
import { ColorsApp } from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import defaultImage from "../assets/defaultImage.jpg";
import { useNavigation, useRoute } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

import { useDispatch } from "react-redux";
import {
  setImages,
  setLocation,
  setNewPublication,
} from "../redux/slices/publicationSlice";
import { getEnabledSpecies } from "../services/SpecieService";

const NewPublicationBasicDataScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [nombreMascota, setNombreMascota] = useState("");
  const [tipoPublicacion, setTipoPublicacion] = useState("Seleccionar");
  const [firstImage, setFirstImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [thirdImage, setThirdImage] = useState(null);

  const [especieValues, setEspeciesValues] = useState([]);
  const [selectedEspecieValue, setSelectedEspecieValue] =
    useState("Seleccionar");

  const [visibleAlert, setVisibleAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const getEspecies = async () => {
    let speciesData = await getEnabledSpecies();
    setEspeciesValues(speciesData);
  };

  useEffect(() => {
    getEspecies();
  }, []);

  const especiesOptions = especieValues.map((value, index) => {
    return (
      <Picker.Item label={value.nombre} value={value.nombre} key={index} />
    );
  });

  const openFirstImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Los permisos de acceso a la camara son requeridos");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: false,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!pickerResult.canceled) {
      setFirstImage({
        localUri: pickerResult.assets[0].uri,
        imageDataBase64: pickerResult.assets[0].base64,
        send: false,
      });
    }
  };

  const openSecondImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Los permisos de acceso a la camara son requeridos");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: false,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!pickerResult.canceled) {
      setSecondImage({
        localUri: pickerResult.assets[0].uri,
        imageDataBase64: pickerResult.assets[0].base64,
      });
    }
  };

  const openThirdImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Los permisos de acceso a la camara son requeridos");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: false,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!pickerResult.canceled) {
      setThirdImage({
        localUri: pickerResult.assets[0].uri,
        imageDataBase64: pickerResult.assets[0].base64,
      });
    }
  };

  const showCameraAsync = async (imageNumber) => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Los permisos de acceso a la camara son requeridos");
      return;
    }
    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: false,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!pickerResult.canceled) {
      switch (imageNumber) {
        case 1:
          {
            setFirstImage({
              localUri: pickerResult.assets[0].uri,
              imageDataBase64: pickerResult.assets[0].base64,
            });
          }
          break;
        case 2:
          {
            setSecondImage({
              localUri: pickerResult.assets[0].uri,
              imageDataBase64: pickerResult.assets[0].base64,
            });
          }
          break;
        case 3:
          {
            setThirdImage({
              localUri: pickerResult.assets[0].uri,
              imageDataBase64: pickerResult.assets[0].base64,
            });
          }
          break;
      }
    }
  };

  const showAlert = (title, message) => {
    setVisibleAlert(true);
    setAlertTitle(title);
    setAlertMessage(message);
  };

  const hideAlert = () => {
    setVisibleAlert(false);
  };
  const basicAlert = () => {
    return (
      <AwesomeAlert
        show={visibleAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={ColorsApp.primaryColor}
        onConfirmPressed={hideAlert}
      />
    );
  };
  const goToNextScreen = () => {
    let images = [];
    if (firstImage != null) images.push(firstImage.imageDataBase64);
    if (secondImage != null) images.push(secondImage.imageDataBase64);
    if (thirdImage != null) images.push(thirdImage.imageDataBase64);

    const publicacion = {
      tipoPublicacion: tipoPublicacion,
      mascota: {
        nombre: nombreMascota,
        especie: {
          nombre: selectedEspecieValue,
        },
      },
    };
    if (nombreMascota.length > 50) {
      showAlert(
        "Error",
        'El campo "Nombre" no puede superar los 50 caracteres'
      );
    } else if (
      tipoPublicacion === "Seleccionar" &&
      selectedEspecieValue === "Seleccionar"
    ) {
      showAlert(
        "Error",
        'Los campos "Especie" y "Tipo de publicación" son obligatorios'
      );
    } else if (selectedEspecieValue === "Seleccionar") {
      showAlert("Error", 'Campo "Especie" obligatorio');
    } else if (tipoPublicacion === "Seleccionar") {
      showAlert("Error", 'Campo "Tipo de publicación" obligatorio');
    } else if (
      firstImage == null &&
      secondImage == null &&
      thirdImage == null
    ) {
      showAlert(
        "Error",
        nombreMascota != ""
          ? "Debes incluir al menos una imagen de " + nombreMascota
          : "Debes incluir al menos una imagen de la mascota"
      );
    } else {
      dispatch(setNewPublication(publicacion));
      dispatch(setImages(images));

      navigation.navigate("NewPublicationFeaturesScreen");
    }
  };

  return (
    <View style={{ height: "100%" }}>
      <TraxpetHeader title="Nueva mascota" />
      <ScrollView style={{ backgroundColor: ColorsApp.primaryBackgroundColor }}>
        <View style={styles.viewOptionsContainer}>
          <Text style={styles.textTitle}>Nombre</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setNombreMascota(text)}
            value={nombreMascota}
            textAlign="center"
            maxLength={50}
            placeholder="firulais, fatiga..."
            placeholderTextColor={"gray"}
          />
        </View>
        {/* Especies picker */}
        <View style={styles.viewOptionsContainer}>
          <Text style={styles.textTitle}>Especie</Text>
          <View style={styles.pickerView}>
            <Picker
              selectedValue={selectedEspecieValue}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedEspecieValue(itemValue);
              }}
              mode="dropdown"
              style={{ width: 250, height: 50, fontSize: 22 }}
            >
              <Picker.Item label="Seleccionar" value={"Seleccionar"} />
              {especiesOptions}
            </Picker>
          </View>
        </View>

        {/* Tipo de publicacion picker */}
        <View style={styles.viewOptionsContainer}>
          <Text style={styles.textTitle}>Tipo de publicación</Text>
          <View style={styles.pickerView}>
            <Picker
              selectedValue={tipoPublicacion}
              onValueChange={(itemValue, itemIndex) =>
                setTipoPublicacion(itemValue)
              }
              mode="dropdown"
              style={{ width: 250, height: 50, fontSize: 22 }}
            >
              <Picker.Item label="Seleccionar" value="Seleccionar" />
              <Picker.Item label="Mascota buscada" value="MASCOTA_BUSCADA" />
              <Picker.Item
                label="Mascota encontrada"
                value="MASCOTA_ENCONTRADA"
              />
            </Picker>
          </View>
        </View>

        {/* Ubicacion button */}
        <View
          style={{
            paddingTop: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Platform.OS === "web"
                ? navigation.navigate("MapWebScreen")
                : navigation.navigate("MapScreen");
            }}
            style={styles.buttonLocation}
          >
            <Ionicons
              style={{ paddingRight: 5 }}
              name="location"
              size={25}
              color={ColorsApp.primaryBackgroundColor}
            />

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                paddingBottom: 5,
                color: ColorsApp.primaryTextColor,
              }}
            >
              Seleccionar ubicación
            </Text>
          </TouchableOpacity>
          <Text style={{ paddingTop: 5, color: "black", fontSize: 24 }}>
            {route.params.location.latitude == 0
              ? "Sin ubicación"
              : "Ubicación seleccionada"}
          </Text>
        </View>
        <View
          style={
            Platform.OS === "web"
              ? styles.containerSectionImagesWeb
              : styles.containerSectionImagesPhone
          }
        >
          {/* Primera imagen */}
          <View style={styles.containerImages}>
            <Image
              source={
                firstImage !== null
                  ? { uri: firstImage.localUri }
                  : defaultImage
              }
              style={styles.image}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.buttonImages}
                onPress={() => openFirstImagePickerAsync()}
              >
                <Ionicons
                  style={{ paddingRight: 5 }}
                  name="image"
                  size={25}
                  color={ColorsApp.primaryBackgroundColor}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    paddingBottom: 5,
                    color: ColorsApp.primaryTextColor,
                  }}
                >
                  Seleccionar Imagen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Platform.OS === "android" ? styles.buttonCamera : null}
                onPress={() => {
                  showCameraAsync(1);
                }}
              >
                <Ionicons
                  name="camera"
                  size={Platform.OS === "android" ? 25 : 0}
                  color={ColorsApp.primaryBackgroundColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Segunda imagen */}
          <View style={styles.containerImages}>
            <Image
              source={
                secondImage !== null
                  ? { uri: secondImage.localUri }
                  : defaultImage
              }
              style={styles.image}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.buttonImages}
                onPress={openSecondImagePickerAsync}
              >
                <Ionicons
                  style={{ paddingRight: 5 }}
                  name="image"
                  size={25}
                  color={ColorsApp.primaryBackgroundColor}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    paddingBottom: 5,
                    color: ColorsApp.primaryTextColor,
                  }}
                >
                  Seleccionar Imagen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Platform.OS === "android" ? styles.buttonCamera : null}
                onPress={() => {
                  showCameraAsync(2);
                }}
              >
                <Ionicons
                  name="camera"
                  size={Platform.OS === "android" ? 25 : 0}
                  color={ColorsApp.primaryBackgroundColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tercera imagen */}
          <View style={styles.containerImages}>
            <Image
              source={
                thirdImage !== null
                  ? { uri: thirdImage.localUri }
                  : defaultImage
              }
              style={styles.image}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.buttonImages}
                onPress={openThirdImagePickerAsync}
              >
                <Ionicons
                  style={{ paddingRight: 5 }}
                  name="image"
                  size={25}
                  color={ColorsApp.primaryBackgroundColor}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    paddingBottom: 5,
                    color: ColorsApp.primaryTextColor,
                  }}
                >
                  Seleccionar Imagen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Platform.OS === "android" ? styles.buttonCamera : null}
                onPress={() => {
                  showCameraAsync(3);
                }}
              >
                <Ionicons
                  name="camera"
                  size={Platform.OS === "android" ? 25 : 0}
                  color={ColorsApp.primaryBackgroundColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={goToNextScreen}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                paddingBottom: 5,
                color: ColorsApp.primaryTextColor,
              }}
            >
              Siguiente
            </Text>
            <Ionicons
              name="chevron-forward"
              size={35}
              color={ColorsApp.primaryBackgroundColor}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {basicAlert()}
    </View>
  );
};

const styles = StyleSheet.create({
  viewOptionsContainer: {
    alignItems: "center",
    padding: 10,
  },
  textInput: {
    height: 40,
    width: 250,
    backgroundColor: ColorsApp.primaryBackgroundColor,
    borderWidth: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    flexDirection: "row",
  },
  buttonLocation: {
    backgroundColor: "orangered",
    alignItems: "center",
    justifyContent: "center",
    width: 205,
    height: 45,
    flexDirection: "row",
    borderRadius: 25,
  },
  button: {
    backgroundColor: "orangered",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "flex-end",
    width: 115,
    height: 40,
    flexDirection: "row",
    borderRadius: 50,
  },
  buttonImages: {
    backgroundColor: "orangered",
    alignItems: "center",
    justifyContent: "center",
    width: 205,
    height: 45,
    flexDirection: "row",
    borderRadius: 25,
  },
  pickerView: {
    alignItems: "center",
    width: 250,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
  image: {
    height: 110,
    width: 110,
    borderRadius: 200,
    resizeMode: "cover",
    marginBottom: 5,
  },
  containerSectionImagesWeb: {
    marginTop: 50,
    marginBottom: 85,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  containerSectionImagesPhone: {
    marginTop: 40,
    marginBottom: 85,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  containerImages: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 20,
  },

  buttonCamera: {
    backgroundColor: "orangered",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  textTitle: { fontWeight: "bold", fontSize: 16, paddingBottom: 5 },
});

export default NewPublicationBasicDataScreen;
