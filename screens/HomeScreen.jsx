import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import TraxpetHeaderHome from "../components/HeaderHome";
import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsApp } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { urlServer } from "../constants/constants";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [publicaciones, setPublicaciones] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  // const urlServer =
  //   "http://if012pf.fi.mdn.unp.edu.ar:28002/traxpet-server/rest";

  const getPublicaciones = async () => {
    const response = await fetch(`${urlServer}/publicaciones/usuario/Teo`);
    const json = await response.json();
    setPublicaciones(json.data);
  };
  const getNotificaciones = async () => {
    const response = await fetch(`${urlServer}/notificaciones/usuario/4`);
    const json = await response.json();
    setNotificaciones(json.data);
  };
  useEffect(() => {
    getPublicaciones();
    getNotificaciones();
  }, []);

  const listEmpty = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          El usuario aun no ha realizado publicaciones
        </Text>
        <FontAwesome5 name="paw" size={32} color={ColorsApp.primaryColor} />
      </View>
    );
  };
  const showPublications = () => {
    return (
      <FlashList
        contentContainerStyle={{ paddingVertical: 20 }}
        data={publicaciones}
        renderItem={renderItem}
        estimatedItemSize={60}
        ListEmptyComponent={listEmpty}
      />
    );
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginVertical: 5,
        }}
        onPress={() => {
          navigation.navigate("UserPublicationNavigation", {
            screen: "UserPublicationScreen",
            params: {
              publication: item,
            },
          });
        }}
      >
        <View style={{ marginHorizontal: 20 }}>
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
          <Text style={styles.itemTitle}>{item.mascota.especie.nombre}</Text>
          <Text style={styles.itemSubtitle}>
            {(item.tipoPublicacion === "MASCOTA_ENCONTRADA"
              ? "Mascota encontrada"
              : "Mascota buscada") +
              "\n" +
              item.fechaPublicacion}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView>
      <StatusBar hidden={true} />
      <TraxpetHeaderHome notificaciones={notificaciones} />
      {showPublications()}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("PublicationNavigation", {
              screen: "PublicationBasicDataScreen",
            });
          }}
        >
          <Ionicons
            name="add"
            size={50}
            color={ColorsApp.primaryBackgroundColor}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  floatingButtonContainer: {
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  button: {
    backgroundColor: ColorsApp.primaryColor,
    borderRadius: 55,
    alignContent: "center",
    alignItems: "center",
    width: 55,
    height: 55,
  },
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
    color: "gray",
  },
  message: { fontWeight: "bold", fontSize: 16, padding: 5 },
});

export default HomeScreen;
