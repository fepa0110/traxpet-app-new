import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { ColorsApp } from "../constants/Colors";

import { getPublicationLocations } from "../services/LocationService";
import { getImagesByMascotaId } from "../services/ImageService";
import LargePrimaryButton from "../components/LargePrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

import Header from "../components/Header";

const UserPublicationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [publicacion, setPublicacion] = useState(route.params.publication);

  const [images, setImages] = useState([]);
  const [locationsData, setLocationsData] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    getUbicaciones();
    getImagenes();
  }, []);

  const getUbicaciones = async () => {
    const response = await getPublicationLocations(publicacion.id);

    if (response.StatusCode == 200) {
      setLocationsData(response.data);
    }
  };

  const getImagenes = async () => {
    const imagesResponse = await getImagesByMascotaId(publicacion.mascota.id);

    if (imagesResponse.StatusCode == 200) setImages(imagesResponse.data);
  };

  const featureTextData = publicacion.mascota.valores.map((valor, index) => {
    return (
      <View key={`caracteristica${index}`} style={styles.textContainer}>
        <Text style={styles.textTitle}>
          {valor.caracteristica.nombre + ":"}
        </Text>
        <Text style={styles.textData}>{valor.nombre}</Text>
      </View>
    );
  });

  const listEmpty = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.message}>No hay imagenes</Text>
        <FontAwesome5
          name="frown-open"
          size={32}
          color={ColorsApp.primaryColor}
        />
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.containerImages}>
        <Image
          source={{
            uri: "data:image/jpg;base64," + item.ImagenData,
          }}
          style={styles.image}
        />
      </View>
    </View>
  );

  const showPet = () => {
    return (
      <View style={styles.viewOptionsContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Especie: </Text>
          <Text style={styles.textData}>
            {publicacion.mascota.especie.nombre}
          </Text>
        </View>

        {publicacion.mascota.nombre !== "" ? (
          <View style={styles.textContainer}>
            <Text style={styles.textTitle}>Nombre: </Text>
            <Text style={styles.textData}>{publicacion.mascota.nombre}</Text>
          </View>
        ) : (
          <View></View>
        )}
        {featureTextData}
      </View>
    );
  };

  const navigateToLocation = () => {
    Platform.OS === "web"
      ? navigation.navigate("UserPublicationNavigation", {
          screen: "LocationEditWebScreen",
          params: {
            locationsData: locationsData,
            editable: false,
          },
        })
      : navigation.navigate("UserPublicationNavigation", {
          screen: "LocationEditScreen",
          params: {
            locationsData: locationsData,
            editable: false,
          },
        });
  };

  return (
    <View style={{ height: "100%" }}>
      <Header title="Publicacion" />
      <View
        style={{
          height: "23%",
          paddingVertical: 20,
          justifyContent: "center",
          alignSelf: "center",
          alignItems: "center",
          width: "70%",
        }}
      >
        <ScrollView horizontal={true}>
          <FlashList
            horizontal={true}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={images}
            renderItem={renderItem}
            estimatedItemSize={2}
            ListEmptyComponent={listEmpty}
          />
        </ScrollView>
      </View>

      <ScrollView style={{ backgroundColor: ColorsApp.primaryBackgroundColor }}>
        {showPet()}
        <View style={styles.buttonLocationContainer}>
          <LargePrimaryButton
            title="Ver ubicaciones"
            actionFunction={() => {
              navigateToLocation();
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <SecondaryButton
            title="Editar"
            actionFunction={() =>
              navigation.navigate("UserPublicationNavigation", {
                screen: "EditPublicationScreen",
                params: {
                  publicacion: publicacion,
                  images: images,
                  locations: locationsData.ubicacion,
                },
              })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewOptionsContainer: {
    alignItems: "center",
    // padding: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 20,
  },
  buttonLocationContainer: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 110,
    width: 110,
    borderRadius: 200,
    resizeMode: "cover",
    marginBottom: 5,
  },
  containerSectionImagesWeb: {
    marginTop: 40,
    marginBottom: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  containerSectionImagesPhone: {
    marginTop: 40,
    marginBottom: 40,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  containerImages: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    paddingBottom: 10,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 25,
    paddingRight: 15,
    color: ColorsApp.primaryTextColor,
  },
  textData: {
    fontSize: 20,
    color: ColorsApp.primaryTextColor,
  },

  message: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 5,
  },
});

export default UserPublicationScreen;
