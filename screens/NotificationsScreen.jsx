import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { ColorsApp } from "constants/Colors";
import Header from "@/Header";

import { useSelector } from "react-redux";

import {
	getNotificacionesByUserIdRequest,
	readNotification,
} from "services/NotificationService";
import { TipoPublicacion } from "constants/TipoPublicacion";

const NotificationsScreen = () => {
	const user = {
		id: useSelector((state) => state.user.id),
		username: useSelector((state) => state.user.username),
	};

	const [notificaciones, setNotificaciones] = useState([]);

	const getNotificaciones = async () => {
		const notificacionesUser = await getNotificacionesByUserIdRequest(
			user.id
		);
		setNotificaciones(notificacionesUser.data);
	};

	useEffect(() => {
		getNotificaciones();
	}, []);

	const listEmpty = () => {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					El usuario aun no tiene notificaciones
				</Text>
				<FontAwesome5 name="paw" size={32} color={ColorsApp.primaryColor} />
			</View>
		);
	};
	const showNotifications = () => {
		return (
			<FlashList
				contentContainerStyle={{ paddingVertical: 20 }}
				data={notificaciones}
				renderItem={renderItem}
				estimatedItemSize={60}
				ListEmptyComponent={listEmpty}
			/>
		);
	};

	const readNotificacion = async (notification) => {
		const response = await readNotification(notification);
		if (response.StatusCode == 200) {
			getNotificaciones();
			console.log("Se borro");
		}
	};

	const renderItem = ({ item }) => (
		<View
			style={{
				flexDirection: "row",
				marginVertical: 5,
			}}>
			<TouchableOpacity
				style={{
					flexDirection: "row",
					width: "92%",
				}}>
				<View style={{ marginHorizontal: 20, alignItems: "center" }}>
					<FontAwesome5
						name={
							item.tipoPublicacion === TipoPublicacion.MASCOTA_VISTA
								? "map-marked-alt"
								: "search-location"
						}
						size={item.tipoPublicacion === TipoPublicacion.MASCOTA_VISTA ? 28 : 32}
						color={ColorsApp.primaryColor}
					/>
				</View>
				<View
					style={{
						flexDirection: "column",
					}}>
					<Text style={styles.itemTitle}>
						{item.publicacion.mascota.especie.nombre}
					</Text>
					<Text style={styles.itemSubtitle}>
						{(item.publicacion.tipoPublicacion === TipoPublicacion.MASCOTA_VISTA
							? "Mascota vista"
							: "Mascota buscada") +
							"\nVista: " +
							item.fechaNotificacion +
							"\nVista por: " +
							item.notificante.username}
					</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={{ width: "5%", alignItems: "center" }}
				onPress={() => {
					readNotificacion(item);
				}}>
				<Ionicons
					name="checkmark-done-circle"
					size={24}
					color={ColorsApp.primaryColor}
				/>
			</TouchableOpacity>
		</View>
	);

	return (
		<ScrollView style={{ backgroundColor: ColorsApp.primaryBackgroundColor }}>
			<Header title="Notificaciones" />
			<View>{showNotifications()}</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { justifyContent: "center", alignItems: "center" },
	item: {
		backgroundColor: "#f9c2ff",
	},
	itemTitle: {
		fontSize: 15,
		fontWeight: "bold",
	},
	itemSubtitle: {
		fontSize: 13,
		color: ColorsApp,
	},
	message: {
		fontWeight: "bold",
		fontSize: 16,
		padding: 5,
		color: ColorsApp.primaryTextColor,
	},
});

export default NotificationsScreen;
