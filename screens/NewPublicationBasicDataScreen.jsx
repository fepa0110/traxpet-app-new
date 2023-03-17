import {
	View,
	Text,
	TextInput,
	ScrollView,
	StyleSheet,
	Image,
	Platform,
} from "react-native";
import React, { useEffect } from "react";

import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import Header from "@/Header";
import { ColorsApp } from "constants/Colors";
import * as ImagePicker from "expo-image-picker";
import defaultImage from "../assets/defaultImage.jpg";
import { useNavigation, useRoute } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

import { Input } from "@rneui/themed";

import { useDispatch, useSelector } from "react-redux";
import {
	setImages,
	setLocation,
	setNewPublication,
	resetNewPublication,
} from "../config-redux/slices/publicationSlice";
import { getEnabledSpecies } from "services/SpecieService";
import LargePrimaryButton from "@/LargePrimaryButton";
import PrimaryButton from "@/PrimaryButton";
import IconButton from "@/IconButton";
import { TipoPublicacion } from "constants/TipoPublicacion";

const NewPublicationBasicDataScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const location = useSelector((state) => state.newPublication).location;
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

	useEffect(() => {
		getEspecies();
	}, []);

	const getEspecies = async () => {
		let especies = await getEnabledSpecies();
		setEspeciesValues(especies.data);
	};

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
			<Header title="Nueva mascota" />
			<ScrollView style={styles.scrollView}>
				<View style={styles.nombreInputView}>
					<Input
						style={styles.textInput}
						label="Nombre"
						placeholder="Firulais"
						labelStyle={{ color: ColorsApp.primaryTextColor }}
						inputStyle={{ color: ColorsApp.primaryTextColor }}
						inputContainerStyle={{ color: ColorsApp.primaryTextColor }}
						containerStyle={{ color: ColorsApp.primaryTextColor }}
						errorStyle={{ color: ColorsApp.errorColor }}
						onChangeText={(nombreValue) => setNombreMascota(nombreValue)}
						cursorColor={ColorsApp.primaryColor}
					/>
				</View>

				{/* Especies picker */}
				<View style={styles.pickerView}>
					<Text style={styles.textTitle}>Especie</Text>
					<Picker
						selectedValue={selectedEspecieValue}
						onValueChange={(itemValue, itemIndex) => {
							setSelectedEspecieValue(itemValue);
						}}
						mode="dropdown"
						style={styles.pickers}
						dropdownIconColor={ColorsApp.primaryTextColor}>
						<Picker.Item label="Seleccionar" value={"Seleccionar"} />
						{especiesOptions}
					</Picker>
				</View>

				{/* Tipo de publicacion picker */}
				<View style={styles.pickerView}>
					<Text style={styles.textTitle}>Tipo de publicación</Text>
					<Picker
						selectedValue={tipoPublicacion}
						onValueChange={(itemValue, itemIndex) =>
							setTipoPublicacion(itemValue)
						}
						mode="dropdown"
						style={styles.pickers}
						dropdownIconColor={ColorsApp.primaryTextColor}>
						<Picker.Item label="Seleccionar" value="Seleccionar" />
						<Picker.Item
							label="Mascota buscada"
							value={TipoPublicacion.MASCOTA_BUSCADA}
						/>
						<Picker.Item
							label="Mascota vista"
							value={TipoPublicacion.MASCOTA_VISTA}
						/>
					</Picker>
				</View>

				{/* Ubicacion button */}
				<View
					style={{
						paddingTop: 30,
						justifyContent: "center",
						alignItems: "center",
					}}>
					<LargePrimaryButton
						title="Seleccionar ubicacion"
						actionFunction={() => {
							Platform.OS === "android"
								? navigation.navigate("MapScreen")
								: navigation.navigate("MapWebScreen");
						}}
					/>

					<Text
						style={{
							paddingTop: 5,
							color: ColorsApp.primaryTextColor,
							fontSize: 24,
						}}>
						{Object.keys(location).length == 0
							? "Sin ubicación"
							: "Ubicación seleccionada"}
					</Text>
				</View>
				<View
					style={
						Platform.OS === "web"
							? styles.containerSectionImagesWeb
							: styles.containerSectionImagesPhone
					}>
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
						<View style={styles.buttonImagesView}>
							<PrimaryButton
								title="Seleccionar"
								actionFunction={() => openFirstImagePickerAsync()}
							/>
							{Platform.OS === "android" ? (
								<IconButton
									iconName="camera"
									onPressFunction={() => {
										showCameraAsync(1);
									}}
									size={40}
								/>
							) : null}
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
						<View style={styles.buttonImagesView}>
							<PrimaryButton
								title="Seleccionar"
								actionFunction={() => {
									openSecondImagePickerAsync();
								}}
							/>
							{Platform.OS === "android" ? (
								<IconButton
									iconName="camera"
									onPressFunction={() => {
										showCameraAsync(2);
									}}
									size={40}
								/>
							) : null}
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
						<View style={styles.buttonImagesView}>
							<PrimaryButton
								title="Seleccionar"
								actionFunction={() => {
									openThirdImagePickerAsync();
								}}
							/>
							{Platform.OS === "android" ? (
								<IconButton
									iconName="camera"
									onPressFunction={() => {
										showCameraAsync(3);
									}}
									size={40}
								/>
							) : null}
						</View>
					</View>
				</View>
			</ScrollView>
			<View style={styles.nextButton}>
				<PrimaryButton
					title="Siguiente"
					actionFunction={() => {
						goToNextScreen();
					}}
				/>
			</View>
			{basicAlert()}
		</View>
	);
};

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: ColorsApp.primaryBackgroundColor,
	},
	textInput: {
		height: 40,
		width: 250,
	},
	nombreInputView: {
		marginTop: 10,
		width: "80%",
		justifyContent: "center",
		alignSelf: "center",
	},
	pickerView: {
		alignItems: "center",
		alignSelf: "center",
		width: "75%",
		height: 80,
		borderBottomWidth: 1,
		borderBottomColor: ColorsApp.secondaryTextColor,
		marginTop: 15,
	},
	pickers: {
		width: "100%",
		height: 40,
		fontSize: 22,
		color: ColorsApp.primaryTextColor,
		backgroundColor: ColorsApp.primaryBackgroundColor,
	},
	nextButton: {
		alignSelf: "center",
		padding: 5,
		width: "50%",
		alignItems: "center",
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
	buttonImagesView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		height: 110,
		width: 110,
		resizeMode: "stretch",
		marginBottom: 5,
	},
	containerSectionImagesWeb: {
		marginTop: 50,
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	containerSectionImagesPhone: {
		marginTop: 40,
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
	textTitle: {
		alignSelf: "flex-start",
		fontWeight: "bold",
		fontSize: 16,
		color: ColorsApp.primaryTextColor,
	},
});

export default NewPublicationBasicDataScreen;
