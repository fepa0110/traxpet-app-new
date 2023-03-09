import { View, Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState } from "react";
import AwesomeAlert from "react-native-awesome-alerts";

import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../redux/slices/publicationSlice";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import IconButton from "../components/IconButton";

import * as Location from "expo-location";
import { ColorsApp } from "../constants/Colors";

const MapScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const location = useSelector((state) => state.newPublication).location;

  const [coords, setCoords] = useState({
    latitude: -42.78585228825225,
    longitude: -65.00578155999852,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [disabledButton, setDisableButton] = useState(true);

  useEffect(() => {
    if (!(Object.keys(location).length == 0)) {
      setCoords(location);
    }
  }, []);

  const openAlert = (title, messsage) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertMessage(messsage);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  const alerta = () => {
    return (
      <AwesomeAlert
        show={showAlert}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Aceptar"
        confirmButtonColor={ColorsApp.primaryColor}
        onConfirmPressed={() => {
          hideAlert();
        }}
      />
    );
  };
  const getCurrentPosition = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Los permisos de acceso a la ubicacion del dispositivo son requeridos"
      );
    }
    const location = await Location.getCurrentPositionAsync({});
    setCoords({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setDisableButton(false);
  };


  const movementMarker = (e) => {
    const latitude = e.nativeEvent.coordinate.latitude;
    const longitude = e.nativeEvent.coordinate.longitude;

    setCoords({
      latitude: latitude,
      longitude: longitude,
    });
  };

  const onClickMap = (e) => {
    const { latitude, longitude } = e.coordinate;

    setCoords({
      latitude: latitude,
      longitude: longitude,
    });

    setDisableButton(false);
  };
 
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0042,
          longitudeDelta: 0.0121,
        }}
        
        zoomControlEnabled={true}
        
          onPress={(e) => onClickMap(e.nativeEvent)}
      >
        <Marker
          draggable
          coordinate={coords}
          title="ubicacion"
          onDragEnd={(e) => movementMarker(e)}
        />
      </MapView>
      <View style={styles.buttonStyle}>
        <SecondaryButton
          title="Atras"
          actionFunction={() => navigation.goBack()}
        />
        <IconButton
          iconName="crosshairs"
          size={50}
          onPressFunction={() => getCurrentPosition()}
        />
        <PrimaryButton
          title="Aceptar"
          disabled={disabledButton}
          actionFunction={() => {
            openAlert("Coordenadas Ingresadas ", "Correctamente");
            dispatch(setLocation(coords));
            navigation.navigate("PublicationBasicDataScreen");
          }}
        />
      </View>
      {alerta()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsApp.primaryBackgroundColor,

  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonStyle: {
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    top: "90%",
    flexDirection: "row",
  },
});

export default MapScreen;
