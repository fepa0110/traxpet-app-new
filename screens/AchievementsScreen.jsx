import React, { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	useWindowDimensions,
} from "react-native";

import { FlashList } from "@shopify/flash-list";

import { Input } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { getUserByUsernameRequest } from "../services/UsuarioService";
import {
	getGivenLevelsByUsername,
	getLevels,
	getLevelByUsername,
} from "../services/AchievementsService";

import Header from "../components/Header";
import LoadingIndicator from "../components/LoadingIndicator";

import { ColorsApp } from "../constants/Colors";
import CircularProgress, {
	ProgressRef,
} from "react-native-circular-progress-indicator";
import Separator from "../components/Separator";

const AchievementsScreen = () => {
	const { height, width } = useWindowDimensions();

	const user = useSelector((state) => state.user);

	const [isLoading, setIsLoading] = useState(true);
	const [nivelActual, setNivelActual] = useState({});
	const [nivelesObtenidos, setNivelesObtenidos] = useState([]);

	const progressRef = useRef();

	useEffect(() => {
		console.log(user);
		getNivelActual();
		getNivelesObtenidos();
	}, []);

	const getNivelActual = async () => {
		const nivelActualRes = await getLevelByUsername(user.username);
		setNivelActual(await nivelActualRes.data);
	};

	const getNivelesObtenidos = async () => {
		const nivelesObtenidosResponse = await getGivenLevelsByUsername(
			user.username
		);
		setNivelesObtenidos(await nivelesObtenidosResponse.data);
		setIsLoading(false);
	};

	const AchievementsView = () => {
		if (isLoading) {
			return (
				<View style={{ justifyContent: "center", height: "100%" }}>
					<LoadingIndicator />
				</View>
			);
		} else
			return (
				<View style={styles.mainView}>
					<CircularProgress
						ref={progressRef}
						value={user.puntaje}
						maxValue={nivelActual.puntajeMaximo}
						radius={100}
						duration={2000}
						activeStrokeColor={ColorsApp.primaryColor}
						inActiveStrokeColor={ColorsApp.secondaryColor}
						progressValueColor={ColorsApp.primaryColor}
						title="Puntos"
						subtitle={"Nivel " + nivelActual.nivel}
						subtitleStyle={{
							color: ColorsApp.secondaryColor,
							fontSize: 25,
						}}
						titleColor={ColorsApp.primaryColor}
						titleStyle={{ fontSize: 25 }}
					/>
					<Text style={{ fontSize: 25, color: ColorsApp.secondaryColor }}>
						Te faltan {nivelActual.puntajeMaximo - user.puntaje} para el
						siguiente nivel
					</Text>
					<Separator width={width / 1.5} />
					<View
						style={{
							paddingVertical: 15,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<FontAwesome5
							name="trophy"
							size={60}
							color={ColorsApp.primaryColor}
						/>
						<Text
							style={{
								fontSize: 25,
								color: ColorsApp.primaryColor,
								fontWeight: "bold",
							}}>
							Beneficios
						</Text>
						{nivelesObtenidos.map((item) => {
							return (
								<View style={{
										marginVertical: 3,
										flexDirection: "row",
										alignItems: "center",
									}} key={"premio"+item.id}>
									<FontAwesome5
										name="angle-right"
										size={20}
										color={ColorsApp.primaryColor}
									/>
									<Text style={{ fontSize: 16 }}>{item.premio}</Text>
								</View>
							);
						})}
					</View>
				</View>
			);
	};

	return (
		<View style={{ height: "100%" }}>
			<Header title="Logros" />
			<AchievementsView />
		</View>
	);
};

const styles = StyleSheet.create({
	mainView: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 30,
	},
});

export default AchievementsScreen;
