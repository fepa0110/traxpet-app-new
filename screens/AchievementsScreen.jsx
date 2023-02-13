import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { FlashList } from "@shopify/flash-list";

import { Input } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { getUserByUsernameRequest } from "../services/UsuarioService";
import { getLevels } from "../services/AchievementsService";

import Header from "../components/Header";
import { ColorsApp } from "../constants/Colors";

const AchievementsScreen = () => {
	const [levelsValue, setLevelsValue] = useState([]);
	const [userOwner, setUserOwner] = useState([]);
	const [plaHolder, setPlaHolder] = useState("");
	const [plaHolderScore, setPlaHolderScore] = useState("");
	const [plaHolderNextLv, setPlaHolderNextLv] = useState("");

	const user = useSelector((state) => state.user);

	useEffect(() => {
		getLevel();
		setPlaceHolder();
	},[]);

	const getLevel = async () => {
		const users = await getUserByUsernameRequest(user.username);
		setUserOwner(users.data);
	};

	const setPlaceHolder = async () => {
		const lvs = await getLevels();
		setPlaHolder("Estas en el Nivel " + userOwner.logro?.nivel);
		setPlaHolderScore("Tus puntos : " + userOwner.puntaje);

		const sum = userOwner.logro?.maximo - userOwner.puntaje;
		setPlaHolderNextLv("Con " + sum + " puntos más, subís de nivel");
		const data = [];
		const result = Object.values(lvs.data).find((value) => {
			if (value.nivel <= userOwner.logro?.nivel) data.push(value);
		});
		setLevelsValue(data);
	};

	const renderItem = ({ item }) => (
		<View style={styles.singleItem}>
			<View style={styles.row}>
				<View style={styles.cardContent}>
					<Text style={styles.description}>Nivel {item.nivel}</Text>
				</View>
				<View style={styles.cardContent}>
					<Text style={styles.description}>Premio {item.premio}</Text>
				</View>
			</View>
		</View>
	);

  const listEmpty = () => {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					No hay logros
				</Text>
				<FontAwesome5 name="paw" size={32} color={ColorsApp.primaryColor} />
			</View>
		);
	};

	return (
		<View style={{ height: "100%" }}>
			<Header title="Logros" />
			<View>
				<Input
					style={styles.textInput}
					label={plaHolder}
					placeholder={plaHolderScore}
					editable={false}
					labelStyle={{ color: ColorsApp.primaryTextColor }}
					inputContainerStyle={{ color: ColorsApp.primaryTextColor }}
					containerStyle={{ color: ColorsApp.primaryTextColor }}
				/>
				<Input
					label={plaHolderNextLv}
					placeholder="Subí de nivel sumando puntos para conseguir más y mejores beneficios"
					editable={false}
				/>
        <ScrollView>
          <FlashList
            data={levelsValue}
            contentContainerStyle={{
              backgroundColor: ColorsApp.primaryBackgroundColor,
              paddingVertical: 50,
            }}
            renderItem={renderItem}
            ListEmptyComponent={listEmpty}
            estimatedItemSize={20}
          />
        </ScrollView>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	itemTitle: {
		fontSize: 15,
		fontWeight: "bold",
		marginHorizontal: 10,
	},

	singleItem: {
		margin: 8,
		padding: 8,
		minHeight: 44,
		flex: 1,
		borderWidth: 1,
		borderColor: ColorsApp.primaryColor,
		borderRadius: 10,
		backgroundColor: "ivory",
	},
	description: {
		fontSize: 14,
		color: ColorsApp.primaryTextColor,
	},
	row: {
		flexDirection: "row",
	},
	cardContent: {
		flexShrink: 1,
		flexGrow: 1,
	},
});
export default AchievementsScreen;
