import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Image, Platform } from "react-native";

import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";

import Header from "../components/Header";
import { ColorsApp } from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";

import { useNavigation, useRoute } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

import { Input } from "@rneui/themed";

import PrimaryButton from "../components/PrimaryButton";
import IconButton from "../components/IconButton";
import { getPublicationLocations } from "../services/LocationService";

import { updatePublication } from "../services/PublicationService";
import { updateImage } from "../services/ImageService";
import LargePrimaryButton from "../components/LargePrimaryButton";

const EditPublicationScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const [nombreMascota, setNombreMascota] = useState(
		route.params.publicacion.mascota.nombre
	);
	// const [formValid, setFormValid] = useState(true);
	const [publicacion, setPublicacion] = useState(route.params.publicacion);
	const [imagenes, setImagenes] = useState(route.params.images);
	const [firstImage, setFirstImage] = useState(null);
	const [secondImage, setSecondImage] = useState(null);
	const [thirdImage, setThirdImage] = useState(null);
	const [buttonEnable, setButtonEnable] = useState(true);

	const [locationsData, setLocationsData] = useState({});
	// const [ubicacionData, setUbicacionData] = useState(route.params.ubicacion);
	const [showAlerta, setShowAlerta] = useState(false);
	const [alertTitle, setAlertTitle] = useState("");
	const [alertMessage, setAlertMessage] = useState("");

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			if (imagenes[0] !== undefined) {
				setFirstImage({
					uri: "data:image/jpg;base64," + imagenes[0].ImagenData,
				});
			}

			if (imagenes[1] !== undefined) {
				setSecondImage({
					uri: "data:image/jpg;base64," + imagenes[1].ImagenData,
				});
			}
			if (imagenes[2] !== undefined) {
				setThirdImage({
					uri: "data:image/jpg;base64," + imagenes[2].ImagenData,
				});
			}
			getUbicaciones();
		});
		return unsubscribe;
	}, [navigation]);

	const getUbicaciones = async () => {
		const response = await getPublicationLocations(publicacion.id);
		if (response.StatusCode == 200) {
			setLocationsData(response.data);
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

		if (pickerResult.canceled) {
			return;
		}

		setButtonEnable(false);
		switch (imageNumber) {
			case 1:
				{
					if (firstImage != null) {
						setFirstImage({
							uri: pickerResult.assets[0].uri,
							imageDataBase64: pickerResult.assets[0].base64,
							send: true,
							id: imagenes[0].id,
						});
					} else {
						setFirstImage({
							uri: pickerResult.assets[0].uri,
							imageDataBase64: pickerResult.assets[0].base64,
							send: true,
							id: 0,
						});
					}
				}
				break;
			case 2:
				{
					if (secondImage != null) {
						setSecondImage({
							uri: pickerResult.assets[0].uri,
							imageDataBase64: pickerResult.assets[0].base64,
							send: true,
							id: imagenes[1].id,
						});
					} else {
						setSecondImage({
							uri: pickerResult.assets[0].uri,
							imageDataBase64: pickerResult.assets[0].base64,
							send: true,
							id: 0,
						});
					}
				}
				break;
			case 3:
				{
					if (thirdImage != null) {
						setThirdImage({
							uri: pickerResult.assets[0].uri,
							imageDataBase64: pickerResult.assets[0].base64,
							send: true,
							id: imagenes[2].id,
						});
					} else {
						setThirdImage({
							uri: pickerResult.assets[0].uri,
							imageDataBase64: pickerResult.assets[0].base64,
							send: true,
							id: 0,
						});
					}
				}
				break;
		}
	};

	const generatePublicationJson = () => {
		console.log(nombreMascota);
		setPublicacion({
			id: publicacion.id,
			mascota: {
				id: publicacion.mascota.id,
				nombre: nombreMascota,
			},
		});
	};

	//Falta agregar generico para cualquier imagen, agregar id de mascota y obtener formato
	const sendImages = async (imagenData, mascotaId, imagenId) => {
		await updateImage(imagenData, mascotaId, imagenId);
	};

	const sendPublication = async () => {
		if (nombreMascota.length > 50) {
			openAlert(
				"Error",
				"El campo nombre de mascota no puede superar los 50 caracteres"
			);
		} else {
			let imagenesEnviar = [];
			if (firstImage != null && firstImage.send == true)
				imagenesEnviar.push({
					imagen: firstImage.imageDataBase64,
					id: firstImage.id,
				});

			if (secondImage != null && secondImage.send == true)
				imagenesEnviar.push({
					imagen: secondImage.imageDataBase64,
					id: secondImage.id,
				});
			if (thirdImage != null && thirdImage.send == true)
				imagenesEnviar.push({
					imagen: thirdImage.imageDataBase64,
					id: thirdImage.id,
				});

			let responsePublication = await updatePublication(publicacion.id, {
				id: publicacion.id,
				mascota: {
					id: publicacion.mascota.id,
					nombre: nombreMascota,
				},
			});

			//Si se  edito existosamente
			if (
				responsePublication != null &&
				responsePublication.StatusCode == 200
			) {
				imagenesEnviar.forEach((imagen, index) => {
					sendImages(imagen.imagen, publicacion.mascota.id, imagen.id);
				});
				navigation.navigate("Home");
			} else {
				openAlert("Error", "Se produjo un error al generar la publicación");
			}
		}
	};

	const openAlert = (title, messsage) => {
		setShowAlerta(true);
		setAlertTitle(title);
		setAlertMessage(messsage);
	};

	const hideAlert = () => {
		setShowAlerta(false);
	};

	const openFirstImagePickerAsync = async () => {
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
		if (pickerResult.canceled) {
			return;
		}
		setButtonEnable(false);
		if (firstImage != null) {
			setFirstImage({
				uri: pickerResult.assets[0].uri,
				imageDataBase64: pickerResult.assets[0].base64,
				send: true,
				id: imagenes[0].id,
			});
		} else
			setFirstImage({
				uri: pickerResult.assets[0].uri,
				imageDataBase64: pickerResult.assets[0].base64,
				send: true,
				id: 0,
			});
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
		if (pickerResult.canceled) {
			return;
		}

		setButtonEnable(false);

		if (secondImage != null) {
			setSecondImage({
				uri: pickerResult.assets[0].uri,
				imageDataBase64: pickerResult.assets[0].base64,
				send: true,
				id: imagenes[1].id,
			});
		} else
			setSecondImage({
				uri: pickerResult.assets[0].uri,
				imageDataBase64: pickerResult.assets[0].base64,
				send: true,
				id: 0,
			});
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
		if (pickerResult.canceled === true) {
			return;
		}

		setButtonEnable(false);

		if (thirdImage != null) {
			setThirdImage({
				uri: pickerResult.assets[0].uri,
				imageDataBase64: pickerResult.assets[0].base64,
				send: true,
				id: imagenes[2].id,
			});
		} else
			setThirdImage({
				uri: pickerResult.assets[0].uri,
				imageDataBase64: pickerResult.assets[0].base64,
				send: true,
				id: 0,
			});
	};

	const alerta = () => {
		return (
			<AwesomeAlert
				show={showAlerta}
				showProgress={false}
				title={alertTitle}
				message={alertMessage}
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={false}
				showConfirmButton={true}
				confirmText="Ok"
				confirmButtonColor={ColorsApp.primaryBackgroundColor}
				onConfirmPressed={() => {
					hideAlert();
				}}
			/>
		);
	};

	const defaultImage = () => {
		return (
			<View
				style={{
					width: 120,
					height: 120,
					backgroundColor: ColorsApp.secondaryColor,
					justifyContent: "center",
					alignItems: "center",
					marginVertical: 5,
				}}>
				<FontAwesome5
					name="image"
					size={60}
					color={ColorsApp.primaryButtonTextColor}
				/>
			</View>
		);
	};

	return (
		<View style={{ height: "100%" }}>
			<Header title="Editar Publicacion" />

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
						cursorColor={ColorsApp.primaryColor}
						errorStyle={{ color: ColorsApp.errorColor }}
						onChangeText={(text) => {
							setNombreMascota(text);
							setButtonEnable(false);
						}}
					/>
				</View>
				<View style={{alignSelf: "center"}}>
					<LargePrimaryButton
						title="Agregar ubicacion"
						actionFunction={() => {
							navigation.navigate("UserPublicationNavigation", {
								screen: "LocationEditScreen",
								params: {
									mascotaId: publicacion.mascota.id,
									locationsData: locationsData,
									editable: true,
                  editado: false
								},
							});
						}}
					/>
				</View>
				<View
					style={
						Platform.OS === "web"
							? styles.containerSectionImagesWeb
							: styles.containerSectionImagesPhone
					}>
					{/* Primera imagen */}
					<View style={styles.containerImages}>
						{firstImage !== null ? (
							<Image
								source={{ uri: firstImage.uri }}
								style={styles.image}
							/>
						) : (
							defaultImage()
						)}
						<View style={{ flexDirection: "row" }}>
							<PrimaryButton
								title="Seleccionar"
								actionFunction={() => {
									openFirstImagePickerAsync();
								}}
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
						{secondImage !== null ? (
							<Image
								source={{ uri: secondImage.uri }}
								style={styles.image}
							/>
						) : (
							defaultImage()
						)}
						<View style={{ flexDirection: "row" }}>
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

					{secondImage !== null ? (
						<View style={styles.containerImages}>
							{thirdImage !== null ? (
								<Image
									source={{ uri: thirdImage.uri }}
									style={styles.image}
								/>
							) : (
								defaultImage()
							)}
							<View style={{ flexDirection: "row" }}>
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
					) : (
						<View></View>
					)}
				</View>
			</ScrollView>
			<View style={styles.buttonContainer}>
				<PrimaryButton
					title="Guardar"
					actionFunction={() => {
						sendPublication();
					}}
					disabled={buttonEnable}
				/>
			</View>
			{alerta()}
		</View>
	);
};

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: ColorsApp.primaryBackgroundColor,
	},
	nombreInputView: {
		marginTop: 10,
		width: "80%",
		justifyContent: "center",
		alignSelf: "center",
	},
	textInput: {
		height: 40,
		width: 250,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingBottom: 20,
	},
	image: {
		height: 120,
		width: 120,
		resizeMode: "cover",
		marginBottom: 5,
	},
	containerSectionImagesWeb: {
		marginTop: 50,
		marginBottom: 5,
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	containerSectionImagesPhone: {
		marginTop: 40,
		marginBottom: 5,
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
});

export default EditPublicationScreen;
