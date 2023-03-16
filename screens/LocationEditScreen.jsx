import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ColorsApp } from "constants/Colors";

import PrimaryButton from "@/PrimaryButton";
import SecondaryButton from "@/SecondaryButton";
import IconButton from "@/IconButton";

import AwesomeAlert from "react-native-awesome-alerts";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { addUbicacionMascota } from "services/PublicationService";
import { useSelector } from "react-redux";
import * as Location from "expo-location";

const LocationEditScreen = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const user = {
		id: useSelector((state) => state.user.id),
		username: useSelector((state) => state.user.username),
	};

	const locationsData = route.params.locationsData;
	const mascotaId = route.params.mascotaId;

	const editable = route.params.editable;
	const [coords, setCoords] = useState({
		latitude: -42.78585228825225,
		longitude: -65.00578155999852,
	});

	const [showAlert, setShowAlert] = useState(false);
	const [alertTitle, setAlertTitle] = useState("");
	const [alertMessage, setAlertMessage] = useState("");

	useEffect(() => {
		console.log(locationsData);
	}, []);

	const openAlert = (title, messsage) => {
		setShowAlert(true);
		setAlertTitle(title);
		setAlertMessage(messsage);
	};

	const hideAlert = () => {
		setShowAlert(false);
	};

	const movementMarker = (e) => {
		const latitude = e.nativeEvent.coordinate.latitude;
		const longitude = e.nativeEvent.coordinate.longitude;

		setCoords({
			latitude: latitude,
			longitude: longitude,
		});
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
					title={"Usuario: "+location.usuario.username}
					description={location.fecha}
				/>
			);
		});

		if (editable === true) {
			markers.push(
				<Marker
					key={"Nueva ubicacion"}
					draggable
					coordinate={coords}
					title="Nueva ubicacion"
				/>
			);
		}
		return markers;
	};

	const addLocation = async () => {
		const ubicacion = {
			latitude: coords.latitude,
			longitude: coords.longitude,
			usuario: {
				username: user.username,
			},
		};
		await addUbicacionMascota(ubicacion, mascotaId);
		navigation.goBack();
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
			latitude: coords.latitude,
			longitude: location.coords.longitude,
		});
		setDisableButton(false);
	};

	const showAddLocation = () => {
		if (editable)
			return (
				<PrimaryButton
					title="Agregar"
					actionFunction={() => {
						openAlert(
							"Agregar ubicacion",
							"¿Esta seguro de agregar esta ubicacion a la publicacion?"
						);
					}}
				/>
			);
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
				showCancelButton={true}
				cancelText="No"
				onCancelPressed={hideAlert}
				confirmText="Si"
				confirmButtonColor={ColorsApp.primaryColor}
				onConfirmPressed={() => {
					hideAlert();
					addLocation();
				}}
			/>
		);
	};

	const MapaAndroid = () => {
		return (
			<View style={styles.container}>
				<MapView
					style={styles.map}
					initialRegion={{
						latitude: coords.latitude,
						longitude: coords.longitude,
						latitudeDelta: 0.0042,
						longitudeDelta: 0.0121,
					}}
					provider={PROVIDER_GOOGLE}
					zoomControlEnabled={true}
					onPress={(direction) => movementMarker(direction)}>
					{showLocations()}
				</MapView>
				<View style={styles.buttonStyle}>
					<SecondaryButton
						title="Atras"
						actionFunction={() => {
							navigation.goBack();
						}}
					/>
					<IconButton
						iconName="crosshairs"
						size={50}
						onPressFunction={() => getCurrentPosition()}
					/>
					{showAddLocation()}
				</View>
				{alerta()}
			</View>
		);
	};

	return <MapaAndroid />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: ColorsApp.primaryBackgroundColor,
		justifyContent: "flex-end",
	},
	map: {
		width: "100%",
		height: "98%",
	},
	buttonStyle: {
		width: "100%",
		position: "absolute",
		top: "90%",
		justifyContent: "center",
		flexDirection: "row",
    alignItems: "center"
	},
});

export default LocationEditScreen;
