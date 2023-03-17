import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";

import HeaderHome from "@/HeaderHome";

import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { ColorsApp } from "constants/Colors";

import { useNavigation } from "@react-navigation/native";

import { resetNewPublication } from "../config-redux/slices/publicationSlice";

import { useSelector, useDispatch } from "react-redux";
import {
  getPublicacionesBuscadasByUserRequest,
  getPublicacionesVistasByUserRequest,
} from "services/PublicationService";
import { getNotificacionesByUserIdRequest } from "services/NotificationService";
import FloatingButton from "@/FloatingButton";
import { FlashList } from "@shopify/flash-list";

import { urlServer } from "constants/constants";
import LoadingIndicator from "@/LoadingIndicator";

const HomeScreen = () => {
  const { width, height } = useWindowDimensions();
  const listColumns = 3;

  const user = {
    id: useSelector((state) => state.user.id),
    username: useSelector((state) => state.user.username),
  };

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const [publicaciones, setPublicaciones] = useState([]);

  const [publicacionesVistas, setPublicacionesVistas] = useState([]);
  const [publicacionesBuscadas, setPublicacionesBuscadas] = useState([]);

  const [imagenesMascotasVistas, setImagenesMascotasVistas] = useState([]);
  const [imagenesMascotasBuscadas, setImagenesMascotasBuscadas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [notificaciones, setNotificaciones] = useState([]);
  const dispatch = useDispatch();

  const getPublicaciones = async () => {
    setIsLoading(true);
    const vistas = await getPublicacionesVistasByUserRequest(user.username);

    const vistasIds = vistas.data.map((pub) => {
      return pub.mascota.id;
    });

    if (vistasIds.length !== 0) {
      const response = await fetch(
        `${urlServer}/imagenesMascota/mascotasActivas`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify(vistasIds),
        }
      );
      const imagenes = await response.json();

      setImagenesMascotasVistas(imagenes.data);
    }
    const buscadas = await getPublicacionesBuscadasByUserRequest(user.username);

    const buscadasIds = buscadas.data.map((pub) => {
      return pub.mascota.id;
    });

    if (buscadasIds.length !== 0) {
      const response = await fetch(
        `${urlServer}/imagenesMascota/mascotasActivas`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify(buscadasIds),
        }
      );
      const imagenes = await response.json();

      setImagenesMascotasBuscadas(imagenes.data);
    }
    setPublicacionesBuscadas(buscadas.data);
    setPublicacionesVistas(vistas.data);
    setIsLoading(false);
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

  const listEmpty = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          El usuario aun no ha realizado publicaciones de este tipo
        </Text>
        <FontAwesome5 name="paw" size={32} color={ColorsApp.primaryColor} />
      </View>
    );
  };

  const showViewedPublications = () => {
    return (
      <View style={{ height: height / 2 - 40, width: "100%" }}>
        <Text style={styles.title}>Mascotas vistas</Text>
        <FlashList
          horizontal={true}
          data={publicacionesVistas}
          renderItem={renderVistas}
          estimatedItemSize={30}
          ListEmptyComponent={listEmpty}
          // numColumns={listColumns}
        />
      </View>
    );
  };

  const showSearchedPublications = () => {
    return (
      <View style={{ height: height / 2 - 40, width: "100%" }}>
        <Text style={styles.title}>Mascotas buscadas</Text>
        <FlashList
          horizontal={true}
          data={publicacionesBuscadas}
          renderItem={renderBuscadas}
          estimatedItemSize={30}
          ListEmptyComponent={listEmpty}
          // numColumns={listColumns}
        />
      </View>
    );
  };

  const renderVistas = ({ item }) => {
    const image = imagenesMascotasVistas.find(
      (imagen) => imagen.id === item.mascota.id
    );
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UserPublicationNavigation", {
              screen: "UserPublicationScreen",
              params: {
                publication: item,
              },
            });
          }}
        >
          <Image
            source={{ uri: `data:image/jpg;base64,${image.ImagenData}` }}
            style={{
              height: width / listColumns - 5,
              width: width / listColumns - 5,
              resizeMode: "stretch",
              // borderRadius: 10,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: ColorsApp.primaryColor,
            }}
          >
            Ultima actividad
          </Text>
          <Text style={{ textAlign: "center" }}>{item.fechaModificacion}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBuscadas = ({ item }) => {
    const image = imagenesMascotasBuscadas.find(
      (imagen) => imagen.id === item.mascota.id
    );
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UserPublicationNavigation", {
              screen: "UserPublicationScreen",
              params: {
                publication: item,
              },
            });
          }}
        >
          <Image
            source={{ uri: `data:image/jpg;base64,${image.ImagenData}` }}
            style={{
              height: width / listColumns - 5,
              width: width / listColumns - 5,
              resizeMode: "stretch",
              // borderRadius: 20,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: ColorsApp.primaryColor,
            }}
          >
            Ultima actividad
          </Text>
          <Text style={{ textAlign: "center" }}>{item.fechaModificacion}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showScreen = () => {
    return (
      <View style={{ height: "100%", width: "100%" }}>
        {showSearchedPublications()}
        {showViewedPublications()}
      </View>
    );
  };

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
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
      {isLoading ? <LoadingIndicator /> : showScreen()}

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
  imageContainer: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    padding: 2,
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
  title: {
    fontWeight: "bold",
    fontSize: 22,
    padding: 5,
    color: ColorsApp.primaryColor,
  },
});

export default HomeScreen;
