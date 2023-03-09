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
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../redux/slices/userSlice";

import { getUserByUsernameRequest } from "../services/UsuarioService";
import {
	getGivenLevelsByUsername,
	getLevels,
	getLevelByUsername,
} from "../services/AchievementsService";

import Header from "../components/Header";
import LoadingIndicator from "../components/LoadingIndicator";

import { ColorsApp } from "../constants/Colors";

import Separator from "../components/Separator";
import { CircularProgress } from "../components/CircularProgress";

const AchievementsScreen = () => {
	const { height, width } = useWindowDimensions();

	const user = useSelector((state) => state.user);

	const [isLoading, setIsLoading] = useState(true);
	const [nivelActual, setNivelActual] = useState({});
	const [nivelesObtenidos, setNivelesObtenidos] = useState([]);
	const [puntajeUser, setPuntajeUser] = useState(puntajeUser);
	
	const progressRef = useRef();

	useEffect(() => {
		getUserData();
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

	const getUserData = async () => {
		const newUserRequest = await getUserByUsernameRequest(user.username);
		setPuntajeUser(newUserRequest.data.puntaje)
	}
	
	const calcularPorcentaje = () => {
		let puntajeUser = puntajeUser;

		if(puntajeUser > nivelActual.puntajeMaximo) {
			puntajeUser = nivelActual.puntajeMaximo;
		}

		return (puntajeUser * 100) / nivelActual.puntajeMaximo;
		// puntajeMaximo --> 100%
		// puntajeActual --> porcentaje
	};

	const mensajePuntosFaltantes = () => {
		const puntajeRestante = nivelActual.puntajeMaximo - puntajeUser;
		
		if(puntajeRestante > 0) return "Te faltan "+puntajeRestante+ " para el siguiente nivel"
		else return "Ya tenes el maximo de puntos!"
	}

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
						value={puntajeUser}
						valueColor={ColorsApp.primaryTextColor}
						valueSize={50}
						progress={calcularPorcentaje()}
						size={200}
						title="Puntos"
						titleColor={ColorsApp.primaryTextColor}
						titleSize={20}
						subtitle={"Nivel " + nivelActual.nivel}
						subtitleColor={ColorsApp.secondaryTextColor}
						subtitleSize={20}
					/>
					<Text style={{ fontSize: 25, color: ColorsApp.secondaryColor }}>
						{mensajePuntosFaltantes()}
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
								<View
									style={{
										marginVertical: 3,
										flexDirection: "row",
										alignItems: "center",
									}}
									key={"premio" + item.id}>
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
		marginVertical: 15,
	},
});

export default AchievementsScreen;
