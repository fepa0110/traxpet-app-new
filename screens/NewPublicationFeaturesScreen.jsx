import {
	Text,
	StyleSheet,
	ScrollView,
	View,
	TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ColorsApp } from "../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";
import TraxpetHeader from "../components/Header";

import { useSelector, useDispatch } from "react-redux";
import { setNewPublication } from "../redux/slices/publicationSlice";
import { getFeaturesBySpecieName } from "../services/FeatureService";

import LoadingIndicator from "../components/LoadingIndicator";
import LargePrimaryButton from "../components/LargePrimaryButton";
import { Divider } from "@rneui/themed";

const NewPublicationFeaturesScreen = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();

	const user = useSelector((state) => state.user);
	const publicacion = useSelector((state) => state.newPublication).publication;
	const location = useSelector((state) => state.newPublication).location;

	const [featuresValues, setFeaturesValues] = useState([]);
	const [selectedFeaturesValues, setSelectedFeaturesValues] = useState(
		new Map()
	);
	const [selectedFeatureValue, setselectedFeatureValue] = useState([]);
	useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [showAlert, setShowAlert] = useState(false);
	const [alertTitle, setAlertTitle] = useState("");
	const [alertMessage, setAlertMessage] = useState("");

	const getFeaturesData = async () => {
		let featuresData = await getFeaturesBySpecieName(
			publicacion.mascota.especie.nombre
		);
		setIsLoading(false);
		setFeaturesValues(featuresData);
	};
	useEffect(() => {
		getFeaturesData();
	}, []);

	const generatePublicationJson = () => {
		let valuesSelected = [];
		let publicacionAux = {};

		for (let [nameValue, nameFeature] of selectedFeaturesValues) {
			if (nameFeature !== "Seleccionar") {
				valuesSelected.push({
					nombre: nameValue,
					caracteristica: {
						nombre: nameFeature,
					},
				});
			}
		}

		publicacionAux = {
			tipoPublicacion: publicacion.tipoPublicacion,
			usuario: {
				username: user.username,
			},
			ubication: location,
			mascota: {
				especie: publicacion.mascota.especie,
				nombre: publicacion.mascota.nombre,
				valores: valuesSelected,
			},
		};
		dispatch(setNewPublication(publicacionAux));
		console.log(publicacionAux);
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
				confirmText="Aceptar"
				confirmButtonColor={ColorsApp.primaryColor}
				onConfirmPressed={() => {
					setShowAlert(false);
				}}
			/>
		);
	};

	const featuresOptions = (feature) => {
		let options = [];
		// setSelectedFeaturesValues(
		//   new Map(selectedFeaturesValues.set(feature.nombre, "Seleccionar"))
		// );
		options.push(
			<Picker.Item
				label="Seleccionar"
				value="Seleccionar"
				key={feature.nombre + "ValueDefault"}
				style={{ color: ColorsApp.primaryTextColor }}
			/>
		);
		feature.valores.map((value, index) => {
			options.push(
				<Picker.Item
					label={value.nombre}
					value={value.nombre}
					key={feature.nombre + index}
				/>
			);
		});
		return options;
	};

	const featuresPickers = () => {
		const pickers = [];
		featuresValues.map((feature, index) => {
			pickers.push(
				<View style={styles.pickerView} key={index}>
					<Text style={styles.textTitle}>{feature.nombre}</Text>
					<Picker
						multiple={false}
						selectedValue={selectedFeaturesValues.get(feature.nombre)}
						onValueChange={(value) =>
							setSelectedFeaturesValues(
								new Map(
									selectedFeaturesValues.set(feature.nombre, value)
								)
							)
						}
						mode="dropdown"
						style={styles.pickers}
						dropdownIconColor={ColorsApp.primaryTextColor}
						key={index}>
						{featuresOptions(feature)}
					</Picker>
				</View>
			);
		});
		return pickers;
	};

	const featuresView = () => {
		return (
			<ScrollView style={{ marginTop: 15, marginBottom: 15 }}>
				{featuresPickers()}
				<View style={styles.buttonContainer}>
					<Divider
						orientation="horizontal"
						color="#AAA"
						width={1}
						style={{ width: 150, marginVertical: 15 }}
					/>
				</View>
			</ScrollView>
		);
	};

	return (
		<View style={{ height: "100%", backgroundColor: ColorsApp.primaryBackgroundColor}}>
			<TraxpetHeader title="Caracteristicas" />
			{isLoading ? <LoadingIndicator /> : featuresView()}
			<View style={{alignItems: "center", marginBottom: 10}}> 
				<LargePrimaryButton
					title="Siguiente"
					actionFunction={() => {
						generatePublicationJson();
						navigation.navigate("SimilarPetScreen");
					}}
					disabled={false}
				/>
			</View>
			{alerta()}
		</View>
	);
};

const styles = StyleSheet.create({
	viewOptionsContainer: {
		alignItems: "center",
		padding: 10,
	},
	buttonContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 10,
	},
	buttonPublicar: {
		backgroundColor: ColorsApp.primaryColor,
		alignItems: "center",
		justifyContent: "center",
		width: 115,
		height: 40,
		flexDirection: "row-reverse",
		borderRadius: 50,
		marginTop: 10,
		marginLeft: 10,
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
	image: {
		height: 100,
		width: 100,
		borderRadius: 100,
		resizeMode: "contain",
		marginBottom: 5,
	},
	textTitle: {
		alignSelf: "flex-start",
		fontWeight: "bold",
		fontSize: 16,
		color: ColorsApp.primaryTextColor,
	},
});

export default NewPublicationFeaturesScreen;
