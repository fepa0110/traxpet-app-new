import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ColorsApp } from "../constants/Colors";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import AwesomeAlert from "react-native-awesome-alerts";
import MapView, { Marker } from "react-native-maps";

const LocationEditScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const locationsData = route.params.locationsData;
  const editable = route.params.editable;
  const [coords, setCoords] = useState({
    latitude: -42.78585228825225,
    longitude: -65.00578155999852,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (locationsData != undefined || locationsData.lenght != 0) {
      setCoords({
        latitude: locationsData[0].latitude,
        longitude: locationsData[0].longitude,
      });
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

  const showLocations = () => {
    const markers = [];
    locationsData.map((location, index) => {
      markers.push(
        <Marker
          key={location.id}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={"Ubicación " + (index + 1)}
          description={location.fecha}
        />
      );
    });
    return markers;
  };

  const onClickMap = (e) => {
    const { latitude, longitude } = e.coordinate;

    setCoords({
      latitude: latitude,
      longitude: longitude,
    });
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

  const mapaAndroid = () => {
    return(
      <View>
        <MapView
          style={styles.map}
          region={{
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0042,
            longitudeDelta: 0.0121,
          }}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          moveOnMarkerPress={false}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          provider="google"
          onPress={(e) => {
            if (editable) onClickMap(e.nativeEvent);
          }}
        >
          {showLocations()}
        </MapView>
        <View style={styles.buttonStyle}>
          <SecondaryButton
            title="Atras"
            actionFunction={() => navigation.goBack()}
          />
          <PrimaryButton
            title="Aceptar"
            disabled={!editable}
            actionFunction={() => {
              openAlert("Coordenadas Ingresadas ", "Correctamente");
            }}
          />
        </View>
        {alerta()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {Platform.OS != "web" ?  mapaAndroid() : null}
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
    top: "90%",
    justifyContent: "space-around",
    flexDirection: "row",
  },
});

export default LocationEditScreen;
