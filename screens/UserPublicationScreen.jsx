import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Platform,
	Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { ColorsApp } from "../constants/Colors";

import { getPublicationLocations } from "../services/LocationService";
import { getImagesByMascotaId } from "../services/ImageService";
import LargePrimaryButton from "../components/LargePrimaryButton";
import LargeSecondaryButton from "../components/LargeSecondaryButton";
import SecondaryButton from "../components/SecondaryButton";

import Header from "../components/Header";

import {
	getPublicacionById,
	markAsFound,
} from "../services/PublicationService";
import LoadingIndicator from "../components/LoadingIndicator";

const UserPublicationScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const publicacionId = route.params.publication.id;
	const mascotaId = route.params.publication.mascota.id;

	const [publicacion, setPublicacion] = useState({});

	const [images, setImages] = useState([]);
	const [locationsData, setLocationsData] = useState({
		latitude: 0,
		longitude: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [titleBotonEncontrado, setTitleBotonEncontrado] = useState("");

	useEffect(() => {
		getData();
	}, []);

	const findPublicacionById = async () => {
		const responsePublicacion = await getPublicacionById(publicacionId);
		setPublicacion(responsePublicacion.data);
		getTitleBotonEncontrado();
	};

	const getTitleBotonEncontrado = () => {
		console.log(publicacion.estado);
		if (!publicacion.estado) {
			setTitleBotonEncontrado("ERROR");
		} else {
			if (publicacion.estado.toUppercase() === "ENCONTRADA") {
				setTitleBotonEncontrado("Encontrada");
			} else if (publicacion.estado.toUppercase() === "ACTIVA")
				setTitleBotonEncontrado("Marcar como encontrada");
			else if (publicacion.estado.toUppercase() === "INACTIVA")
				setTitleBotonEncontrado("Mascota inactiva");
			else setTitleBotonEncontrado("ERROR");
		}
	};

	const getData = async () => {
		await findPublicacionById();
		await getUbicaciones();
		await getImagenes();
		setIsLoading(false);
	};

	const getUbicaciones = async () => {
		const response = await getPublicationLocations(publicacionId);
		if (response.StatusCode == 200) {
			setLocationsData(response.data);
		}
	};

	const getImagenes = async () => {
		const imagesResponse = await getImagesByMascotaId(mascotaId);
		if (imagesResponse.StatusCode == 200) setImages(imagesResponse.data);
	};

	const listEmpty = () => {
		return (
			<View style={{ flexDirection: "row" }}>
				<Text style={styles.message}>No hay imagenes</Text>
				<FontAwesome5
					name="frown-open"
					size={32}
					color={ColorsApp.primaryColor}
				/>
			</View>
		);
	};

	const listEmptyFeatures = () => {
		return (
			<View style={{ flexDirection: "row" }}>
				<Text style={styles.message}>Sin caracteristicas</Text>
				<FontAwesome5
					name="frown-open"
					size={32}
					color={ColorsApp.primaryColor}
				/>
			</View>
		);
	};

	const renderItem = ({ item }) => (
		<View>
			<View style={styles.containerImages}>
				<Image
					source={{
						uri: "data:image/jpg;base64," + item.ImagenData,
					}}
					style={styles.image}
				/>
			</View>
		</View>
	);

	const renderItemFeature = ({ item }) => (
		<View style={styles.featuresContainer}>
			<Text style={styles.textTitle}>
				{item.caracteristica.nombre + ":"}
			</Text>
			<Text style={styles.textData}>{item.nombre}</Text>
		</View>
	);

	const marcarPublicacionEncontrada = async () => {
		const responsePublication = await markAsFound(publicacion.id);
		if (responsePublication.StatusCode == 200) {
			navigation.navigate("HomeNavigation");
		}
	};

	const navigateToLocation = () => {
		Platform.OS === "web"
			? navigation.navigate("UserPublicationNavigation", {
					screen: "LocationEditWebScreen",
					params: {
						locationsData: locationsData,
						editable: false,
					},
			  })
			: navigation.navigate("UserPublicationNavigation", {
					screen: "LocationEditScreen",
					params: {
						locationsData: locationsData,
						editable: false,
					},
			  });
	};

	const userPublication = () => {
		return (
			<View style={{ height: "100%" }}>
				<View
					style={{
						height: "22%",
						paddingVertical: 20,
						justifyContent: "center",
						alignSelf: "center",
						alignItems: "center",
						width: "70%",
					}}>
					<View horizontal={true}>
						<FlashList
							horizontal={true}
							data={images}
							renderItem={renderItem}
							estimatedItemSize={20}
							ListEmptyComponent={listEmpty}
						/>
					</View>
				</View>

				<View
					style={{
						backgroundColor: ColorsApp.primaryBackgroundColor,
						height: "70%",
					}}>
					<View style={styles.featuresContainer}>
						<Text style={styles.textTitle}>Nombre:</Text>
						<Text style={styles.textData}>
							{publicacion.mascota.nombre}
						</Text>
					</View>
					<FlashList
						horizontal={false}
						data={publicacion.mascota.valores}
						renderItem={renderItemFeature}
						estimatedItemSize={20}
						ListEmptyComponent={listEmptyFeatures}
					/>
					<View style={styles.buttonContainer}>
						<LargePrimaryButton
							title="Ver ubicaciones"
							actionFunction={() => {
								navigateToLocation();
							}}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<LargeSecondaryButton
							title={
								publicacion.estado.toUpperCase() === "ENCONTRADA"
									? "Encontrada"
									: publicacion.estado.toUpperCase() === "ACTIVA"
									? "Marcar como encontrada"
									: "Mascota inactiva"
							}
							actionFunction={() => {
								marcarPublicacionEncontrada();
							}}
							disabled={
								publicacion.estado.toUpperCase() === "ENCONTRADA" ||
								publicacion.estado.toUpperCase() === "INACTIVA"
							}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<SecondaryButton
							title="Editar"
							actionFunction={() =>
								navigation.navigate("UserPublicationNavigation", {
									screen: "EditPublicationScreen",
									params: {
										publicacion: publicacion,
										images: images,
										locations: locationsData.ubicacion,
									},
								})
							}
							disabled={publicacion.estado == "ENCONTRADA"}
						/>
					</View>
				</View>
			</View>
		);
	};
	return (
		<View style={{ height: "100%" }}>
			<Header title="Publicacion" />
			{isLoading ? <LoadingIndicator /> : userPublication()}
		</View>
	);
};

const styles = StyleSheet.create({
	viewOptionsContainer: {
		alignItems: "center",
	},
	buttonContainer: {
		paddingVertical: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		height: 110,
		width: 110,
		borderRadius: 200,
		resizeMode: "cover",
		marginBottom: 5,
	},
	containerSectionImagesWeb: {
		marginTop: 40,
		marginBottom: 10,
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	containerSectionImagesPhone: {
		marginTop: 40,
		marginBottom: 40,
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	containerImages: {
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 5,
		marginBottom: 10,
	},
	featuresContainer: {
		flexDirection: "row",
		alignItems: "center",
		alignContent: "center",
		paddingHorizontal: 50,
		paddingBottom: 10,
	},
	textTitle: {
		fontWeight: "bold",
		fontSize: 25,
		paddingRight: 15,
		color: ColorsApp.primaryTextColor,
	},
	textData: {
		fontSize: 20,
		color: ColorsApp.primaryTextColor,
	},

	message: {
		fontWeight: "bold",
		fontSize: 16,
		padding: 5,
	},
});

export default UserPublicationScreen;
