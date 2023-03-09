import React, { useEffect, useState } from "react";
import {
	View,
	TouchableOpacity,
	ScrollView,
	Text,
	useWindowDimensions,
} from "react-native";

import { Avatar, Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getPredictByPublication } from "../services/BoostingService";
import { getFeaturesMapByPredict } from "../services/ValueService";
import { getImagesByMascotaId, sendImage } from "../services/ImageService";
import { sendNotificationOwnerUser } from "../services/NotificationService";

import {
	Provider as PaperProvider,
	DataTable,
	List,
	Portal,
	Card,
	Dialog,
	Avatar as AvatarPaper,
} from "react-native-paper";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import LoadingIndicator from "../components/LoadingIndicator";
import { ColorsApp } from "../constants/Colors";
import Header from "../components/Header";
import AwesomeAlert from "react-native-awesome-alerts";
import {
	addUbicacionMascota,
	getPublicationByPetId,
	migrarDueño,
	sendPublication,
} from "../services/PublicationService";
import LargePrimaryButton from "../components/LargePrimaryButton";
import { getByModeloActivoEspecie } from "../services/MascotasEntrenadasService";

const SimilarPetScreen = () => {
	const { height, width } = useWindowDimensions();

	const user = {
		id: useSelector((state) => state.user.id),
		username: useSelector((state) => state.user.username),
	};
	const navigation = useNavigation();
	const publication = useSelector((state) => state.newPublication).publication;
	const images = useSelector((state) => state.newPublication).images;
	const location = useSelector((state) => state.newPublication).location;

	const [isLoading, setIsLoading] = useState(false);
	const [visibleAlert, setVisibleAlert] = useState(false);

	const [visibleModal, setVisibleModal] = useState(false);

	const [alertTitle, setAlertTitle] = useState("");
	const [alertMessage, setAlertMessage] = useState("");
	const [alertConfirmFunction, setAlertConfirmFunction] = useState(() => {});
	const [mascotasSimilares, setMascotaSimilares] = useState([]);

	const [imageData, setImageData] = useState("");

	const numberOfItemsPerPageList = [5, 10, 20, 50];
	const [page, setPage] = useState(0);
	const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
		numberOfItemsPerPageList[0]
	);
	const from = page * numberOfItemsPerPage;
	const to = Math.min(
		(page + 1) * numberOfItemsPerPage,
		mascotasSimilares.length
	);

	useEffect(() => {
		getPredict();
	}, []);

	const getPredict = async () => {
		let idsPredict = await getByModeloActivoEspecie(
			publication.mascota.especie.nombre
		);
		let mapFeatures = await getFeaturesMapByPredict(idsPredict.data);

		let predict = idsPredict.data.map((idMascota, index) => {
			return {
				id: idMascota,
				caracteristicas: mapFeatures.data[index],
			};
		});
		let mascotas = predict.map((prediccion) => {
			let count = 0;
			prediccion.caracteristicas.map((feature) => {
				publication.mascota.valores.map((featurePub) => {
					if (
						featurePub.caracteristica.nombre.normalize() ===
							feature.caracteristica.nombre.normalize() &&
						featurePub.nombre.normalize() === feature.nombre.normalize()
					) {
						count = count + 1;
						return;
					}
				});
			});
			return { ...prediccion, countSimilar: count };
		});
		mascotas.sort((a, b) => b.countSimilar - a.countSimilar);
		setMascotaSimilares(mascotas);
		setIsLoading(false);
	};

	const getPublicacionByMascota = async (mascotaId) => {
		const publicacion = await getPublicationByPetId(mascotaId);
		return await publicacion.data;
	};

	const sendSimilarSelected = async (mascotaId) => {
		navigation.navigate("ConfirmSelectedPet", { mascotaId: mascotaId });
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

		console.log("publicacion: ", publicationToSend);

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

	const showAlert = (title, messsage) => {
		setVisibleAlert(true);
		setAlertTitle(title);
		setAlertMessage(messsage);
	};

	const hideAlert = () => {
		setVisibleAlert(false);
	};

	const alert = () => {
		return (
			<AwesomeAlert
				show={visibleAlert}
				showProgress={false}
				title={alertTitle}
				message={alertMessage}
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={false}
				showConfirmButton={true}
				confirmText="Aceptar"
				showCancelButton={true}
				cancelText="Cancelar"
				onCancelPressed={() => {
					hideAlert();
				}}
				cancelButtonStyle={{
					backgroundColor: ColorsApp.primaryBackgroundColor,
					borderColor: ColorsApp.primaryColor,
					borderWidth: 1,
				}}
				cancelButtonTextStyle={{ color: ColorsApp.primaryColor }}
				confirmButtonColor={ColorsApp.primaryColor}
				onConfirmPressed={() => alertConfirmFunction()}
			/>
		);
	};

	const getImage = async (mascotaId) => {
		const image = await getImagesByMascotaId(mascotaId);
		setImageData(await image.data[0].ImagenData);
	};

	const showModal = () => {
		setVisibleModal(true);
	};
	const hideModal = () => setVisibleModal(false);

	const viewModal = () => {
		return (
			<PaperProvider>
				<View style={{ height: "100%" }}>
					<Portal>
						<Dialog visible={visibleModal} onDismiss={hideModal}>
							<Dialog.Content
								style={{
									justifyContent: "center",
									alignContent: "baseline",
									alignItems: "center",
								}}>
								<AvatarPaper.Image
									size={200}
									source={{
										uri: "data:image/jpg;base64," + imageData,
									}}
								/>
							</Dialog.Content>
							<Dialog.Actions>
								<TouchableOpacity onPress={hideModal}>
									<FontAwesome5
										name="window-close"
										size={25}
										color={ColorsApp.primaryColor}
									/>
								</TouchableOpacity>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				</View>
			</PaperProvider>
		);
	};
	const accordionSubItem = (item) => {
		let subItems = [];
		const lista = publication.mascota.valores;
		const valores = item.caracteristicas;

		subItems.push(
			<List.Item
				title="Imagen"
				titleStyle={{ color: ColorsApp.primaryTextColor }}
				right={() => (
					<View
						style={{
							backgroundColor: ColorsApp.primaryBackgroundColor,
						}}>
						<Avatar
							size="small"
							rounded
							icon={{
								name: "image",
								type: "font-awesome",
								color: ColorsApp.primaryColor,
							}}
							overlayContainerStyle={{ borderColor: "gray" }}
							activeOpacity={0.7}
							containerStyle={styles.image}
							onPress={() => {
								getImage(item.id);
								showModal();
							}}
						/>
					</View>
				)}
				key={item.id}
			/>
		);

		for (let index = 0; index < lista.length; index++) {
			let finded = valores.find((value) => {
				return value.nombre.normalize() === lista[index].nombre.normalize();
			});

			subItems.push(
				<List.Item
					title={
						lista[index].caracteristica.nombre +
						":   \t\t" +
						lista[index].nombre
					}
					right={(props) => (
						<List.Icon
							{...props}
							color={
								finded == undefined ||
								finded.caracteristica.nombre.normalize() !==
									lista[index].caracteristica.nombre.normalize()
									? "red"
									: "blue"
							}
							icon={
								finded == undefined ||
								finded.caracteristica.nombre.normalize() !==
									lista[index].caracteristica.nombre.normalize()
									? "close"
									: "check-all"
							}
						/>
					)}
					key={item.id + "-" + index}
				/>
			);
		}
		return subItems;
	};

	const listEmpty = () => {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					No hay publicaciones que coincidan con la especie de tu mascota
					:c
				</Text>
				<FontAwesome5 name="paw" size={32} color={ColorsApp.primaryColor} />
			</View>
		);
	};

	const accordionItem = () => {
		const itemData = [];

		if (mascotasSimilares.length === 0) {
			return listEmpty();
		} else {
			mascotasSimilares
				.slice(
					page * numberOfItemsPerPage,
					page * numberOfItemsPerPage + numberOfItemsPerPage
				)
				.map((item) => {
					itemData.push(
						<View
							style={{
								flexDirection: "row",
								alignItems: "baseline",
								backgroundColor: ColorsApp.primaryBackgroundColor,
							}}
							key={item.id}>
							<TouchableOpacity
								onPress={() => {
									sendSimilarSelected(item.id);
								}}>
								<MaterialCommunityIcons
									name="cursor-pointer"
									size={24}
									color={ColorsApp.primaryColor}
									backgroundColor={ColorsApp.primaryBackgroundColor}
								/>
							</TouchableOpacity>
							<View
								key={item.id}
								style={{
									width: "98%",
									backgroundColor: ColorsApp.primaryBackgroundColor,
								}}>
								<List.Accordion
									style={{
										backgroundColor: ColorsApp.primaryBackgroundColor,
									}}
									titleStyle={{
										fontWeight: "bold",
										color: ColorsApp.primaryTextColor,
									}}
									key={item.id}
									title={item.id}>
									{accordionSubItem(item)}
								</List.Accordion>
							</View>
						</View>
					);
				});
		}
		return <List.Section key="List Section">{itemData}</List.Section>;
	};

	const showAccordionList = () => {
		return (
			<PaperProvider>
				<View style={{ height: height - 110 }}>
					<ScrollView
						style={{
							backgroundColor: ColorsApp.primaryBackgroundColor,
						}}>
						<DataTable key={"data-table-similar-pet-screen"}>
							{accordionItem()}
						</DataTable>
					</ScrollView>

					<DataTable.Pagination
						page={page}
						numberOfPages={Math.ceil(
							mascotasSimilares.length / numberOfItemsPerPage
						)}
						onPageChange={(page) => setPage(page)}
						label={`${from + 1}-${to} de ${mascotasSimilares.length}`}
						style={{
							color: ColorsApp.primaryTextColor,
						}}
						numberOfItemsPerPageList={numberOfItemsPerPageList}
						numberOfItemsPerPage={numberOfItemsPerPage}
						onItemsPerPageChange={onItemsPerPageChange}
						selectPageDropdownLabel={"elementos por pagina"}
					/>
				</View>
			</PaperProvider>
		);
	};
	const showSimilarPetScreen = () => {
		return (
			<View
				style={{
					backgroundColor: ColorsApp.primaryBackgroundColor,
					height: height,
				}}>
				<Header title="Mascotas similares" />
				{showAccordionList()}
				{viewModal()}
				<View style={{ alignItems: "center", marginVertical: 10 }}>
					<LargePrimaryButton
						title="No es ninguna"
						actionFunction={() => {
							publicar(false, 0);
							navigation.navigate("Home");
						}}
					/>
				</View>
			</View>
		);
	};

	return (
		<View style={{ height: height }}>
			{!isLoading ? showSimilarPetScreen() : <LoadingIndicator />}
			{alert()}
		</View>
	);
};

const styles = () =>
	StyleSheet.create({
		modal: {
			backgroundColor: ColorsApp.primaryBackgroundColor,
			alignItems: "center",
			justifyContent: "center",
			width: 300,
			height: 300,
		},
		image: {
			width: 250,
			height: 250,
		},
		stretch: {
			width: 100,
			height: 200,
			resizeMode: "contain",
		},
		message: {
			fontWeight: "bold",
			fontSize: 16,
			padding: 5,
			color: ColorsApp.primaryTextColor,
		},
		container: { justifyContent: "center", alignItems: "center" },
	});
export default SimilarPetScreen;
