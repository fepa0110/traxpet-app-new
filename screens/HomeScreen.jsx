import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SectionList,
} from "react-native";
import React, { useEffect, useState } from "react";

import HeaderHome from "../components/HeaderHome";

import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";
import { FAB } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

import { ColorsApp } from "../constants/Colors";

import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { getPublicacionesByUserRequest } from "../services/PublicacionService";
import { getNotificacionesByUserIdRequest } from "../services/NotificacionService";

const HomeScreen = () => {
  const user = {
    id: useSelector((state) => state.user.id),
    username: useSelector((state) => state.user.username)
  }

  const navigation = useNavigation();
  const [publicaciones, setPublicaciones] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  const getPublicaciones = async () => {
    let publicacionesUser = await getPublicacionesByUserRequest(user.username)

    setPublicaciones(publicacionesUser.data);
  };

  const getNotificaciones = async () => {
    let notificacionesUser = await getNotificacionesByUserIdRequest(user.id)
    
    setNotificaciones(notificacionesUser.data);
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
    <View style={{ height: "100%" }}>
      <HeaderHome 
        amountNotifications={notificaciones.length} 
        onPressNotifications={() => { 
          navigation.navigate("NotificationsScreen")} 
          }/>
      <ScrollView>
        {showPublications()}
      </ScrollView>
      <FAB
        visible={true}
        placement="right"
        icon={{ name: 'add', color: 'white' }}
        color={ColorsApp.primaryColor}
        onPress={() => {
          navigation.navigate("PublicationNavigation", {
            screen: "PublicationBasicDataScreen",
          });
        }}
      />
      
        {/* <View style={styles.floatingButtonContainer}>
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
        </View> */}
      

    </View >
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
