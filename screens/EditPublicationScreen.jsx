import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import Header from "../components/Header";
import { ColorsApp } from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";

import { useNavigation, useRoute } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

import { Input } from "@rneui/themed";

import { useDispatch } from "react-redux";
import {
	setImages,
	setLocation,
	setNewPublication,
} from "../redux/slices/publicationSlice";
import { getEnabledSpecies } from "../services/SpecieService";
import LargePrimaryButton from "../components/LargePrimaryButton";
import PrimaryButton from "../components/PrimaryButton";
import IconButton from "../components/IconButton";

import { updatePublication } from "../services/PublicationService";

const EditPublicationScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const [nombreMascota, setNombreMascota] = useState(
		route.params.publicacion.mascota.nombre
	);
	const [formValid, setFormValid] = useState(true);
	const [publicacion, setPublicacion] = useState(route.params.publicacion);
	const [imagenes, setImagenes] = useState(route.params.imagenes);
	const [firstImage, setFirstImage] = useState(null);
	const [secondImage, setSecondImage] = useState(null);
	const [thirdImage, setThirdImage] = useState(null);
	const [buttonEnable, setButtonEnable] = useState(true);
	const [ubicacionData, setUbicacionData] = useState(route.params.ubicacion);
	const [showAlert, setShowAlert] = useState(false);
	const [alertTitle, setAlertTitle] = useState("");
	const [alertMessage, setAlertMessage] = useState("");
	const [publicationSuccessfull, setPublicationSuccessfull] = useState(false);
	const [firstImageSuccessfull, setFirstImageSuccessfull] = useState(false);
	const [secondImageSuccessfull, setSecondImageSuccessfull] = useState(false);
	const [thirdImageSuccessfull, setThirdImageSuccessfull] = useState(false);

	useEffect(() => {
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
	}, []);

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

		if (pickerResult.cancelled === true) {
			return;
		}

		setButtonEnable(false);
		switch (imageNumber) {
			case 1:
				{
					if (firstImage != null) {
						setFirstImage({
							uri: pickerResult.uri,
							imageDataBase64: pickerResult.base64,
							send: true,
							id: imagenes[0].id,
						});
					} else {
						setFirstImage({
							uri: pickerResult.uri,
							imageDataBase64: pickerResult.base64,
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
							uri: pickerResult.uri,
							imageDataBase64: pickerResult.base64,
							send: true,
							id: imagenes[1].id,
						});
					} else {
						setSecondImage({
							uri: pickerResult.uri,
							imageDataBase64: pickerResult.base64,
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
							uri: pickerResult.uri,
							imageDataBase64: pickerResult.base64,
							send: true,
							id: imagenes[2].id,
						});
					} else {
						seThirdImage({
							uri: pickerResult.uri,
							imageDataBase64: pickerResult.base64,
							send: true,
							id: 0,
						});
					}
				}
				break;
		}
	};

	const generatePublicationJson = () => {
		setPublicacion({
			id: publicacion.id,
			mascota: {
				id: publicacion.mascota.id,
				nombre: nombreMascota,
			},
		});

		if (route.params.ubicacion == undefined) {
			setPublicacion({
				ubication: { id: 0, latitude: 0, longitude: 0 },
			});
		} else {
			setPublicacion({
				ubication: { id: 0, ...route.params.ubicacion },
			});
		}
	};

	//Falta agregar generico para cualquier imagen, agregar id de mascota y obtener formato
	const updateImage = async (imagenData, mascotaId, imagenId) => {
		const responseImage = await updateImage(imagenData, mascotaId, imagenId);
	};

	const sendPublication = async () => {
		if (nombreMascota.length > 50) {
			showAlert(
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
			if (thirdImage != null && secondImage.send == true)
				imagenesEnviar.push({
					imagen: thirdImage.imageDataBase64,
					id: thirdImage.id,
				});

			await generatePublicationJson();

			let responsePublication = await updatePublication(
				publicacion.id,
				publicacion
			);

			//Si se  edito existosamente
			if (
				responsePublication != null &&
				responsePublication.StatusCode == 200
			) {
				setPublicationSuccessfull(true);
				imagenesEnviar.forEach((imagen, index) => {
					updateImage(imagen.imagen, publicacion.mascota.id, imagen.id);
				});
				navigation.replace("HomeNavigation");
			} else {
				showAlert("Error", "Se produjo un error al generar la publicación");
			}
		}
	};

	const openAlert = (title, messsage) => {
		setShowAlert(true);
		setAlertTitle(title);
		setAlertMessage(messsage);
	};

	const hideAlert = () => {
		showAlert(false);
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
		if (pickerResult.canceled === true) {
			return;
		}
		setButtonEnable(false);
		if (firstImage != null) {
			setFirstImage({
				uri: pickerResult.uri,
				imageDataBase64: pickerResult.base64,
				send: true,
				id: imagenes[0].id,
			});
		} else
			setFirstImage({
				uri: pickerResult.uri,
				imageDataBase64: pickerResult.base64,
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
		if (pickerResult.canceled === true) {
			return;
		}

		setButtonEnable(false);

		if (secondImage != null) {
			setSecondImage({
				uri: pickerResult.uri,
				imageDataBase64: pickerResult.base64,
				send: true,
				id: imagenes[1].id,
			});
		} else
			setSecondImage({
				uri: pickerResult.uri,
				imageDataBase64: pickerResult.base64,
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
				uri: pickerResult.uri,
				imageDataBase64: pickerResult.base64,
				send: true,
				id: imagenes[2].id,
			});
		} else
			setThirdImage({
				uri: pickerResult.uri,
				imageDataBase64: pickerResult.base64,
				send: true,
				id: 0,
			});
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
				confirmText="Ok"
				confirmButtonColor={ColorsApp.primaryBackgroundColor}
				onConfirmPressed={() => {
					hideAlert();
				}}
			/>
		);
	};

	const showUbicacionSeleccionada = () => {
		let textLabel = "";

		if (route.params.ubicacion == undefined) {
			textLabel = "Sin ubicación";
		} else if (
			route.params.ubicacion.latitude == 0 &&
			route.params.ubicacion.longitude == 0
		) {
			textLabel = "Sin ubicación";
		} else if (route.params.ubicacion.latitude != 0) {
			textLabel = "Ubicación seleccionada";
		}

		return (
			<Text style={{ paddingTop: 5, color: "black", fontSize: 24 }}>
				{textLabel}
			</Text>
		);
	};

	return (
		<View style={{height: "100%"}}>
            <Header title="Editar Publicacion" />

			<ScrollView>
				<View style={styles.viewOptionsContainer}>
					<Text
						style={{
							fontWeight: "bold",
							fontSize: 16,
							paddingBottom: 5,
						}}>
						Nombre
					</Text>
					<TextInput
						style={styles.textInput}
						onChangeText={(text) =>{
								setNombreMascota(text);
								setButtonEnable(false);}
						}
						value={nombreMascota}
					/>
				</View>

				{/* Ubicacion button */}
				<View
					style={{
						paddingTop: 30,
						justifyContent: "center",
						alignItems: "center",
					}}>
					<TouchableOpacity
						//disabled={true}

						onPress={() => {
                            setButtonEnable(false)

/* 							Platform.OS === "web"
								? navigation.navigate(
										"UbicationEditScreenWeb",
										{
											ubicacionData: this.state.ubicacionData,
											mobility: true,
										}
								)
								: navigation.navigate(
										"UbicationEditScreen",
										{
											ubicacionData: this.state.ubicacionData,
											mobility: true,
										}
								  ); */
						}}
						style={styles.buttonUbicacion}>
						<Icon
							style={{ paddingRight: 5 }}
							name="location"
							size={25}
							color={ColorsApp.secondaryColor}
						/>

						<Text style={tw`text-white font-medium text-base`}>
							Editar ubicación
						</Text>
					</TouchableOpacity>
					{showUbicacionSeleccionada()}
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
								this.state.firstImage !== null
									? { uri: this.state.firstImage.uri }
									: defaultImage
							}
							style={styles.image}
						/>
						<View style={{ flexDirection: "row" }}>
							<TouchableOpacity
								style={[tw``, styles.buttonImages]}
								onPress={this.openFirstImagePickerAsync}>
								<Icon
									style={{ paddingRight: 5 }}
									name="image"
									size={25}
									color={ColorsApp.secondaryColor}
								/>
								<Text style={tw`text-white font-medium text-base`}>
									Seleccionar Imagen
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={
									Platform.OS === "android"
										? styles.buttonCamera
										: null
								}
								onPress={() => {
									this.showCameraAsync(1);
								}}>
								<Icon
									name="camera"
									size={Platform.OS === "android" ? 25 : 0}
									color={ColorsApp.secondaryColor}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* Segunda imagen */}
					<View style={styles.containerImages}>
						<Image
							source={
								this.state.secondImage !== null
									? { uri: this.state.secondImage.uri }
									: defaultImage
							}
							style={styles.image}
						/>

						<View style={{ flexDirection: "row" }}>
							<TouchableOpacity
								style={[tw``, styles.buttonImages]}
								onPress={this.openSecondImagePickerAsync}>
								<Icon
									style={{ paddingRight: 5 }}
									name="image"
									size={25}
									color={ColorsApp.secondaryColor}
								/>
								<Text style={tw`text-white font-medium text-base`}>
									Seleccionar Imagen
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={
									Platform.OS === "android"
										? styles.buttonCamera
										: null
								}
								onPress={() => {
									this.showCameraAsync(2);
								}}>
								<Icon
									name="camera"
									size={Platform.OS === "android" ? 25 : 0}
									color={ColorsApp.secondaryColor}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* Tercera imagen */}
					{this.state.secondImage !== null ? (
						<View style={styles.containerImages}>
							<Image
								source={
									this.state.thirdImage !== null
										? { uri: this.state.thirdImage.uri }
										: defaultImage
								}
								style={styles.image}
							/>

							<View style={{ flexDirection: "row" }}>
								<TouchableOpacity
									style={[tw``, styles.buttonImages]}
									onPress={this.openThirdImagePickerAsync}>
									<Icon
										style={{ paddingRight: 5 }}
										name="image"
										size={25}
										color={ColorsApp.secondaryColor}
									/>
									<Text style={tw`text-white font-medium text-base`}>
										Seleccionar Imagen
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={
										Platform.OS === "android"
											? styles.buttonCamera
											: null
									}
									onPress={() => {
										this.showCameraAsync(3);
									}}>
									<Icon
										name="camera"
										size={Platform.OS === "android" ? 25 : 0}
										color={ColorsApp.secondaryColor}
									/>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<View></View>
					)}
				</View>

				<View style={[styles.buttonContainer, tw`w-full`]}>
					<TouchableOpacity
						disabled={this.state.buttonEnable}
						style={[tw``, styles.button]}
						onPress={this.sendPublication}>
						<Text style={tw`text-white font-medium text-base`}>
							Guardar
						</Text>
						<Icon
							name="chevron-forward"
							size={35}
							color={ColorsApp.secondaryColor}
						/>
					</TouchableOpacity>
				</View>
			</ScrollView>
			{alerta()}
		</View>
	);
};

export default EditPublicationScreen;
