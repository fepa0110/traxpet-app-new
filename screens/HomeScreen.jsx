import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";

import HeaderHome from "../components/HeaderHome";

import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { ColorsApp } from "../constants/Colors";

import { useNavigation } from "@react-navigation/native";

import { resetNewPublication } from "../redux/slices/publicationSlice";

import { useSelector, useDispatch } from "react-redux";
import { getPublicacionesByUserRequest } from "../services/PublicationService";
import { getNotificacionesByUserIdRequest } from "../services/NotificationService";
import FloatingButton from "../components/FloatingButton";

const HomeScreen = () => {
  const user = {
    id: useSelector((state) => state.user.id),
    username: useSelector((state) => state.user.username),
  };

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const [publicaciones, setPublicaciones] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const dispatch = useDispatch();

  const getPublicaciones = async () => {
    let publicacionesUser = await getPublicacionesByUserRequest(user.username);

    setPublicaciones(publicacionesUser.data);
  };

  const getNotificaciones = async () => {
    let notificacionesUser = await getNotificacionesByUserIdRequest(user.id);

    setNotificaciones(notificacionesUser.data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPublicaciones();
      getNotificaciones();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getPublicaciones();
    getNotificaciones();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
        <View>
          <Text style={styles.itemTitle}>{item.mascota.especie.nombre}</Text>
          <Text style={styles.itemSubtitle}>
            {(item.tipoPublicacion === "MASCOTA_ENCONTRADA"
              ? "Mascota encontrada"
              : "Mascota buscada") +
              "\nCreada: " +
              item.fechaPublicacion +
              "\nModificada: " +
              item.fechaModificacion}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: ColorsApp.primaryBackgroundColor,
      }}
    >
      <HeaderHome
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("NotificationsScreen");
            }}
            style={styles.headerRightComponent}
          >
            <FontAwesome
              name={notificaciones.length == 0 ? "bell-o" : "bell"}
              size={25}
              color={ColorsApp.primaryColor}
            />
            <Text style={styles.textNotification}>{notificaciones.length}</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showPublications()}
      </ScrollView>
      <FloatingButton
        visible={true}
        onPressFunction={() => {
          dispatch(resetNewPublication());
          navigation.navigate("PublicationNavigation", {
            screen: "PublicationBasicDataScreen",
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRightComponent: {
    paddingTop: 10,
    flexDirection: "row",
  },
  textNotification: {
    flex: 2,
    fontSize: 18,
    color: ColorsApp.primaryColor,
    fontWeight: "bold",
  },
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
    color: ColorsApp.primaryTextColor,
  },
  itemSubtitle: {
    fontSize: 13,
    color: ColorsApp.secondaryTextColor,
  },
  message: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 5,
    color: ColorsApp.primaryTextColor,
  },
});

export default HomeScreen;
