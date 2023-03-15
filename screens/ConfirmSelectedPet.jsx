import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";

import {
	addUbicacionMascota,
	getPublicationByPetId,
	migrarDueño,
	sendPublication,
} from "../services/PublicationService";
import { getImagesByMascotaId, sendImage } from "../services/ImageService";

import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import Separator from "../components/Separator";
import LoadingIndicator from "../components/LoadingIndicator";

import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";

import { TipoPublicacion } from "../constants/TipoPublicacion";
import { ColorsApp } from "../constants/Colors";

import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";

const ConfirmSelectedPet = () => {
	const route = useRoute();
	const navigation = useNavigation();

	const user = {
		id: useSelector((state) => state.user.id),
		username: useSelector((state) => state.user.username),
	};

	const publication = useSelector((state) => state.newPublication).publication;

	const [confirmFunction, setConfirmFunction] = useState(() => {});
	const [isLoading, setIsLoading] = useState(false);
	const [mensaje, setMensaje] = useState("");
	const [mascotaId, setMascotaId] = useState(route.params.mascotaId);
	const [imageSelected, setImageSelected] = useState(
		route.params.imageSelected
	);
	const location = useSelector((state) => state.newPublication).location;
	const images = useSelector((state) => state.newPublication).images;
	const [imageData, setImageData] = useState("");
	const [titleHeader, setTitleHeader] = useState("Confirmar publicacion");
	const [featuresMatched, setFeaturesMatched] = useState([]);

	useEffect(() => {
		setSimilarSelected();
	}, []);

	const getPublicacionByMascota = async (mascotaId) => {
		const publicacion = await getPublicationByPetId(mascotaId);
		return publicacion.data;
	};

	const migrarPublicacion = async (publicacionId, username) => {
		const response = await migrarDueño(publicacionId, username);
		return await response.StatusCode;
	};

	const publicar = async (notificateSimilar, mascotaSimilarId) => {
		setIsLoading(true);

		let publicationToSend = {
			publicacion: {
				tipoPublicacion: publication.tipoPublicacion,
				usuario: publication.usuario,
				mascota: publication.mascota,
			},
		};

		if (Object.keys(location).length == 0) {
			publicationToSend = {
				...publicationToSend,
				ubicacion: {
					latitude: 0,
					longitude: 0,
				},
				idMascotaSimilar: mascotaSimilarId,
				notificateSimilar: notificateSimilar,
			};
		} else {
			publicationToSend = {
				...publicationToSend,
				ubicacion: location,
				idMascotaSimilar: mascotaSimilarId,
				notificateSimilar: notificateSimilar,
			};
		}

		// console.log("publicacion: ", publicationToSend);

		const publicationData = await sendPublication(
			publicationToSend,
			notificateSimilar,
			mascotaSimilarId
		);
		//Si se publico existosamente
		if (publicationData != null && publicationData.StatusCode == 200) {
			images.map((image) => {
				sendImage(image, publicationData.data.mascota.id);
			});

			navigation.navigate("Home");
		} else {
			setIsLoading(false);
			showAlert("Error", "Se produjo un error al generar la publicación");
		}
		setIsLoading(false);
	};

	const setSimilarSelected = async () => {
		setIsLoading(true);

		const publicationSelect = await getPublicacionByMascota(mascotaId);
		showMatchingFeatures(await publicationSelect);

		// console.log("" + JSON.stringify(publication));
		// Actualizar ubicacion
		if (publication.tipoPublicacion === TipoPublicacion.MASCOTA_VISTA) {
			if (!(Object.keys(location).length == 0)) {
				// console.log("Actualizar ubicacion...");

				const ubicacion = {
					latitude: location.latitude,
					longitude: location.longitude,
					usuario: {
						username: publication.usuario.username,
					},
				};
				setConfirmFunction(() => async () => {
					await addUbicacionMascota(ubicacion, mascotaId);
					navigation.navigate("Home");
				});

				setTitleHeader("Actualizar ubicacion");
				setMensaje("Se actualizará la ubicacion de la mascota");
			} else {
				setTitleHeader("Actualizar ubicacion");
				setMensaje(
					"No se actualizará la ubicacion de la mascota seleccionada ya que no haz ingresado una"
				);

				setConfirmFunction(() => async () => {
					navigation.navigate("Home");
				});
			}
		} else {
			// console.log("🚀 ~mascotaId:", mascotaId);
			// console.log("🚀 ~ publicationSelect:", publicationSelect);
			//Si soy el dueño y selecciono una mascota encontrada entonces migrar dueño
			if (
				publication.tipoPublicacion === TipoPublicacion.MASCOTA_BUSCADA &&
				publicationSelect.tipoPublicacion === TipoPublicacion.MASCOTA_VISTA
			) {
				// console.log("Migrando...");

				setConfirmFunction(() => async () => {
					// console.log("Migrando publicacion a nuevo dueño...");
					await migrarPublicacion(publicationSelect.id, user.username);
					navigation.navigate("Home");
				});

				setTitleHeader("Transferir dueño");
				setMensaje(
					"Se le transferira la publicación de la mascota a usted"
				);
			}

			// Si ambos son dueños
			if (
				publication.tipoPublicacion === TipoPublicacion.MASCOTA_BUSCADA &&
				publicationSelect.tipoPublicacion ===
					TipoPublicacion.MASCOTA_BUSCADA
			) {
				// console.log("Creando nueva: ambos son dueños...");

				setConfirmFunction(() => async () => {
					await publicar(true, mascotaId);
				});

				setTitleHeader("Notificar al usuario dueño");
				setMensaje(
					"Se le notificará al dueño que vio su mascota" +
						" y se le creará una nueva publicación a usted"
				);
			}
		}
		setIsLoading(false);
	};

	const showMatchingFeatures = (publicationSelected) => {
		const valores = publicationSelected.mascota.valores;
		const lista = publication.mascota.valores;

		let listMatch = [];
		for (let index = 0; index < lista.length; index++) {
			let finded = valores.find((value) => {
				return value.nombre.normalize() === lista[index].nombre.normalize();
			});

			listMatch.push({
				caracteristica:
					lista[index].caracteristica.nombre + ": " + lista[index].nombre,
				match:
					finded == undefined ||
					finded.caracteristica.nombre.normalize() !==
						lista[index].caracteristica.nombre.normalize()
						? false
						: true,
			});
		}
		// console.log("🚀 listMatch:", listMatch);
		setFeaturesMatched(listMatch);
	};

	const renderItem = ({ item }) => (
		<View
			style={{
				flex: 1,
				flexDirection: "row",
				justifyContent: "space-between",
				width: "60%",
				alignSelf: "center",
			}}>
			<Text>{item.caracteristica}</Text>
			<FontAwesome5
				name={item.match ? "check-circle" : "times-circle"}
				size={22}
				color={item.match ? "green" : "red"}
			/>
		</View>
	);

	const itemDivider = () => {
		return (
			<View style={{ alignItems: "center", height: "100%" }}>
				<Separator width="60%" />
			</View>
		);
	};

	const listEmpty = () => {
		return (
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					alignContent: "center",
				}}>
				<Text
					style={{
						fontWeight: "bold",
						fontSize: 16,
						textAlign: "center",
						padding: 5,
						color: ColorsApp.primaryTextColor,
					}}>
					No hay caracteristicas seleccionadas
				</Text>
			</View>
		);
	};

	const confirmScreen = () => {
		return (
			<View style={{ height: "90%", width: "100%" }}>
				<ScrollView style={{ alignSelf: "center", width: "100%" }}>
					<Image
						source={{ uri: `data:image/jpg;base64,${imageSelected}` }}
						style={{
							height: 200,
							width: 200,
							resizeMode: "stretch",
							alignSelf: "center",
							margin: 10,
						}}
					/>
					<View
						style={{
							height:
								featuresMatched.length > 0
									? featuresMatched.length * 55
									: 80,
						}}>
						<FlashList
							contentContainerStyle={{
								paddingVertical: 20,
							}}
							data={featuresMatched}
							renderItem={renderItem}
							estimatedItemSize={5}
							ItemSeparatorComponent={itemDivider}
							ListEmptyComponent={listEmpty}
						/>
					</View>

					<View style={{ alignItems: "center", width: "100%" }}>
						<Separator width="100%" />
					</View>

					<Text
						style={{
							fontSize: 25,
							marginVertical: 15,
							textAlign: "center",
						}}>
						{mensaje}
					</Text>

					<View
						style={{
							marginVertical: 10,
							flexDirection: "row",
							justifyContent: "space-around",
							// alignItems: "space-between",
							// alignContent: "space-between",
							width: "100%",
						}}>
						<SecondaryButton
							title="Volver"
							actionFunction={() => {
								navigation.goBack();
							}}
						/>
						<PrimaryButton
							title="Aceptar"
							actionFunction={confirmFunction}
						/>
					</View>
				</ScrollView>
			</View>
		);
	};

	return (
		<View style={{ height: "100%" }}>
			<Header title={titleHeader} />
			{!isLoading ? confirmScreen() : <LoadingIndicator />}
		</View>
	);
};

export default ConfirmSelectedPet;

const styles = StyleSheet.create({});
