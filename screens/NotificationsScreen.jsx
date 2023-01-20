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
import { ColorsApp } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { urlServer } from "../constants/constants";
import Header from "../components/Header";

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notificaciones, setNotificaciones] = useState([]);

  const getNotificaciones = async () => {
    const response = await fetch(`${urlServer}/notificaciones/usuario/4`);
    const json = await response.json();
    setNotificaciones(json.data);
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

  const readNotification = async (notification) => {
    const response = await readNotification(notification);
    if (response.StatusCode == 200) {
      getNotificaciones();
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 5,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          width: "95%",
        }}
      >
        <View style={{ marginHorizontal: 20, alignItems: "center" }}>
          <FontAwesome5
            name={
              item.tipoPublicacion === "MASCOTA_ENCONTRADA"
                ? "map-marked-alt"
                : "search-location"
            }
            size={item.tipoPublicacion === "MASCOTA_ENCONTRADA" ? 28 : 32}
            color={ColorsApp.primaryColor}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text style={styles.itemTitle}>
            {item.publicacion.mascota.especie.nombre}
          </Text>
          <Text style={styles.itemSubtitle}>
            {(item.publicacion.tipoPublicacion === "MASCOTA_ENCONTRADA"
              ? "Mascota encontrada"
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
          readNotification(item);
        }}
      >
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
      <StatusBar style="light" hidden={true} />
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
  message: { fontWeight: "bold", fontSize: 16, padding: 5 },
});

export default NotificationsScreen;
