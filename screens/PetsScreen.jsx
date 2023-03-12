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

import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getFeaturesMapByPredict } from "../services/ValueService";
import { getImagesByMascotaId, sendImage } from "../services/ImageService";

import { FontAwesome5 } from "@expo/vector-icons";
import LoadingIndicator from "../components/LoadingIndicator";
import { ColorsApp } from "../constants/Colors";
import AwesomeAlert from "react-native-awesome-alerts";

import LargePrimaryButton from "../components/LargePrimaryButton";
import LargeSecondaryButton from "../components/LargeSecondaryButton";
import { getByModeloActivoEspecie } from "../services/MascotasEntrenadasService";
import { urlServer } from "../constants/constants";
import IconButton from "../components/IconButton";

import { sendPublication } from "../services/PublicationService";

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


	const [mascotasSimilares, setMascotaSimilares] = useState([]);

	const [page, setPage] = useState(0);
	const [numberOfItemsPerPage, onItemsPerPageChange] = useState(10);

	const [imagenesMascotas, setImagenesMascotas] = useState([]);

	const { width, height } = useWindowDimensions();
	const listColumns = 4;

	useEffect(() => {
		getPredict();
	}, []);

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

	const fetchImages = async (mascotasSimilares) => {
		console.log("Se actualizan imagenes");
		const mascotasSimilaresIds = mascotasSimilares.map((mascota) => {
			return mascota.id;
		});

		const mascotasParaBuscar = mascotasSimilaresIds.slice(
			page * numberOfItemsPerPage,
			page * numberOfItemsPerPage + numberOfItemsPerPage
		);

		// console.log("🚀 mascotasParaBuscar:", mascotasParaBuscar);

		if (mascotasParaBuscar.length !== 0) {
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
			setImagenesMascotas(mascotitas);
			setPage(page + 1);
		}
	};

	const getPredict = async () => {
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
					No hay publicaciones de esta especie
				</Text>
				<FontAwesome5 name="paw" size={32} color={ColorsApp.primaryColor} />
			</View>
		);
	};

	const renderItem = ({ item }) => {
		return (
			<View style={styles.imageContainer}>
				<TouchableOpacity
					onPress={() => {
						console.log("🚀 mascota:", item.id);
						sendSimilarSelected(item.id);
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

	const listaSimilares = () => {
		return (
			<View style={{ height: "90%" }}>
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
						// backgroundColor: "transparent",
						position: "absolute",
						bottom: 10,
						right: 0,
						left: 0,
					}}>
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
		<View style={{ height: "100%" }}>
			<Header title="Mascotas similares" />
			{!isLoading ? listaSimilares() : <LoadingIndicator />}
		</View>
	);
};

export default PetsScreen;

const styles = StyleSheet.create({
	imageContainer: {
		backgroundColor: "#fff",
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
