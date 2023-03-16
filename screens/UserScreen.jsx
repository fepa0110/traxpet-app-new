import React, { useState } from "react";
import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
} from "react-native";

import { Avatar } from "@rneui/themed";

import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../config-redux/slices/userSlice";

import HeaderHome from "@/HeaderHome";
import { ColorsApp } from "constants/Colors";
import LargePrimaryButton from "@/LargePrimaryButton";
import LargeSecondaryButton from "@/LargeSecondaryButton";
import { useNavigation } from "@react-navigation/native";

const UserScreen = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();

	const user = useSelector((state) => state.user);

	const getRandomColor = () => {
		return (
			"rgb(" +
			Math.floor(Math.random() * 256) +
			"," +
			Math.floor(Math.random() * 256) +
			"," +
			Math.floor(Math.random() * 256) +
			")"
		);
	};

	return (
		<View style={{ height: "100%" }}>
			<HeaderHome />
			<ScrollView>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 15,
					}}>
					<Avatar
						rounded
						size="xlarge"
						title={user.username.slice(0, 2).toUpperCase()}
						activeOpacity={0.7}
						containerStyle={{ backgroundColor: getRandomColor() }}
					/>

					<Text
						style={{ fontSize: 25, fontWeight: "bold", color: "black" }}>
						{user.username}
					</Text>
					<Text
						style={{ fontSize: 20, fontWeight: "bold", color: "grey" }}>
						{user.email}
					</Text>
				</View>

				<View style={styles.buttonView}>
					<LargePrimaryButton
						title="Logros"
						actionFunction={() => {
							navigation.navigate("UserNavigation");
						}}
					/>
				</View>

				{user.rol?.nombre === "Administrador" ? (
					<View style={styles.buttonView}>
						<LargePrimaryButton
							title="Menu administrador"
							actionFunction={() => {
								navigation.navigate("AdminNavigation");
							}}
						/>
					</View>
				) : null}

				<View style={styles.buttonView}>
					<LargeSecondaryButton
						title="Cambiar Contraseña"
						disabled={true}
					/>
				</View>

				<View style={styles.buttonView}>
					<LargeSecondaryButton
						title="Cerrar Sesion"
						actionFunction={() => {
							dispatch(logOut());
							navigation.navigate("LoginNavigation");
						}}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: ColorsApp.primaryBackgroundColor,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		backgroundColor: "orangered",
		alignItems: "center",
		justifyContent: "center",
		width: 205,
		height: 45,
		flexDirection: "row",
		margin: 10,
	},
	buttonView: {
		paddingTop: 30,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default UserScreen;
