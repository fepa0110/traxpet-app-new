import React, { useEffect, useState } from "react";
import {
	View,
	TouchableOpacity,
	FlatList,
	Text,
	StyleSheet,
	Image,
	useWindowDimensions,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { getFeaturesMapByPredict } from "../services/ValueService";
import { sendImage } from "../services/ImageService";
import { getByModeloActivoEspecie } from "../services/MascotasEntrenadasService";
import { sendPublication } from "../services/PublicationService";

import { ColorsApp } from "../constants/Colors";
import { urlServer } from "../constants/constants";

import Header from "../components/Header";
import LargePrimaryButton from "../components/LargePrimaryButton";
import LoadingIndicator from "../components/LoadingIndicator";

const PetsScreen = () => {
	const user = {
		id: useSelector((state) => state.user.id),
		username: useSelector((state) => state.user.username),
	};

	const navigation = useNavigation();

	const publication = useSelector((state) => state.newPublication).publication;
	const images = useSelector((state) => state.newPublication).images;
	const location = useSelector((state) => state.newPublication).location;

	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingImages, setIsLoadingImages] = useState(false);

	const [mascotasSimilares, setMascotaSimilares] = useState([]);

	const [page, setPage] = useState(0);
	const [numberOfItemsPerPage, onItemsPerPageChange] = useState(10);

	const [imagenesMascotas, setImagenesMascotas] = useState([]);

	const { width, height } = useWindowDimensions();
	const listColumns = 4;

	useEffect(() => {
		getPredict();
	}, []);

	const sendSimilarSelected = async (mascotaId, imagenSelected) => {
		// console.log("🚀 ~ mascotaId:", mascotaId)
		navigation.navigate("ConfirmSelectedPet", { mascotaId: mascotaId, imageSelected: imagenSelected });
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

	const fetchImages = async (mascotasSimilares) => {
		// console.log("🚀 ~ mascotasSimilares:", mascotasSimilares);
		
		const mascotasSimilaresIds = mascotasSimilares.map((mascota) => {
			return mascota.id;
		});

		const mascotasParaBuscar = mascotasSimilaresIds.slice(
			page * numberOfItemsPerPage,
			page * numberOfItemsPerPage + numberOfItemsPerPage
		);

		if (mascotasParaBuscar.length != 0) {
			setIsLoadingImages(true);
			const response = await fetch(
				`${urlServer}/imagenesMascota/mascotasActivas`,
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-type": "application/json",
					},
					body: JSON.stringify(mascotasParaBuscar),
				}
			);
			const imagenes = await response.json();

			const mascotitas = imagenesMascotas.concat(imagenes.data);
			console.log("🚀 imagenesMascotas:", imagenesMascotas)
			setImagenesMascotas(mascotitas);
			setPage(page + 1);
			setIsLoadingImages(false);
		}
	};

	const getPredict = async () => {
		setIsLoading(true);

		let idsPredict = await getByModeloActivoEspecie(
			publication.mascota.especie.nombre,
			user.id
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
		fetchImages(mascotas);

		setIsLoading(false);
	};

	const listEmpty = () => {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
				</Text>
				{/* <FontAwesome5 name="paw" size={32} color={ColorsApp.primaryColor} /> */}
			</View>
		);
	};

	const renderItem = ({ item }) => {
		// console.log("🚀 item:", item.id)
		return (
			<View style={styles.imageContainer}>
				<TouchableOpacity
					onPress={() => {
						
						sendSimilarSelected(item.id, item.ImagenData);
					}}>
					<Image
						source={{ uri: `data:image/jpg;base64,${item.ImagenData}` }}
						style={{
							height: width / listColumns,
							width: width / listColumns,
							resizeMode: "stretch",
						}}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	const loadingIndicatorImages = () => {
		if (isLoadingImages) return <LoadingIndicator size={40} />;
		else return <></>;
	};

	const listaSimilares = () => {
		return (
			<View style={{ height: "90%", backgroundColor: ColorsApp.primaryBackgroundColor}}>
				<FlatList
					data={imagenesMascotas}
					keyExtractor={(item, index) => index.toString()}
					renderItem={renderItem}
					onEndReachedThreshold={0.5}
					onEndReached={() => fetchImages(mascotasSimilares)}
					numColumns={listColumns}
					ListEmptyComponent={listEmpty}
					/>
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						alignContent: "center",
						position: "absolute",
						bottom: 10,
						right: 0,
						left: 0,
					}}>
					{loadingIndicatorImages()}
					<LargePrimaryButton
						title={
							mascotasSimilares.length == 0
								? "Publicar"
								: "No es ninguna"
						}
						actionFunction={() => {
							publicar(false, 0);
							navigation.navigate("Home");
						}}
						extraStyles={{
							borderWidth: 2,
							borderColor: ColorsApp.primaryBackgroundColor,
						}}
					/>
				</View>
			</View>
		);
	};

	return (
		<View style={{ height: "100%"}}>
			<Header title="Mascotas similares" />
			{!isLoading ? listaSimilares() : <LoadingIndicator />}
		</View>
	);
};

export default PetsScreen;

const styles = StyleSheet.create({
	imageContainer: {
		backgroundColor: ColorsApp.primaryBackgroundColor,
		padding: 1,
	},
	message: {
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center",
		padding: 5,
		color: ColorsApp.primaryTextColor,
	},
	container: {
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center",
	},
});
