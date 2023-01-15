import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import TraxpetHeader from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { ColorsApp } from "../constants/Colors";

const UserPublicationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const urlServer =
    "http://if012pf.fi.mdn.unp.edu.ar:28002/traxpet-server/rest";
  const [publicacion, setPublicacion] = useState(route.params.publication);

  const [images, setImages] = useState([]);
  const [locationsData, setLocationsData] = useState(null);

  const getUbicaciones = async () => {
    const response = await fetch(
      `${urlServer}/ubicaciones/publicacion/${publicacion.id}`
    );
    const json = await response.json();
    if (json.StatusCode == 200) {
      setLocationsData(json.data);
    } else
      setLocationsData({
        latitude: 0,
        longitude: 0,
      });
  };

  const getImagenes = async () => {
    const response = await fetch(
      urlServer + "/imagenesMascota/" + publicacion.mascota.id
    );
    const json = await response.json();
    if (json.StatusCode == 200) setImages(json.data);
  };

  useEffect(() => {
    getUbicaciones();
    getImagenes();
  }, []);

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

  const showPet = () => {
    return (
      <View style={styles.viewOptionsContainer}>
        <View
          style={
            Platform.OS === "web"
              ? styles.containerSectionImagesWeb
              : styles.containerSectionImagesPhone
          }
        >
          {/* Primera imagen */}
          {images[0] !== undefined ? (
            <View style={styles.containerImages}>
              <Image
                source={{
                  uri: "data:image/jpg;base64," + images[0].ImagenData,
                }}
                style={styles.image}
              />
            </View>
          ) : (
            <View></View>
          )}

          {/* Segunda imagen */}

          {images[1] !== undefined ? (
            <View style={styles.containerImages}>
              <Image
                source={{
                  uri: "data:image/jpg;base64," + images[1].ImagenData,
                }}
                style={styles.image}
              />
            </View>
          ) : null}

          {/* Tercera imagen */}
          {images[2] !== undefined ? (
            <View style={styles.containerImages}>
              <Image
                source={{
                  uri: "data:image/jpg;base64," + images[2].ImagenData,
                }}
                style={styles.image}
              />
            </View>
          ) : null}
        </View>

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

  return (
    <View style={{ height: "100%" }}>
      <TraxpetHeader title="Publicacion" />
      <ScrollView style={{ backgroundColor: ColorsApp.primaryBackgroundColor }}>
        {showPet()}

        <View style={styles.buttonLocationContainer}>
          <TouchableOpacity
            onPress={() => {
              Platform.OS === "web"
                ? navigation.navigate("UserPublicationNavigation", {
                    screen: "LocationEditWebScreen",
                    params: {
                      publicationId: publicacion.id,
                      locationsData: locationsData,
                      mobility: false,
                    },
                  })
                : navigation.navigate("UserPublicationNavigation", {
                    screen: "LocationEditScreen",
                    params: {
                      publicationId: publicacion.id,
                      locationsData: locationsData,
                      mobility: false,
                    },
                  });
            }}
            style={styles.buttonLocation}
          >
            <Ionicons
              name="location"
              size={25}
              color={ColorsApp.primaryBackgroundColor}
            />

            <Text style={styles.title}>Ver ubicación</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("UserPublicationNavigation", {
                screen: "EditPublicationScreen",
                params: {
                  publicacion: publicacion,
                  images: images,
                  locations: locationsData.ubicacion,
                },
              })
            }
          >
            <Text style={styles.title}>Editar</Text>
            <Ionicons
              name="chevron-forward"
              size={35}
              color={ColorsApp.primaryBackgroundColor}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewOptionsContainer: {
    alignItems: "center",
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 20,
  },
  buttonLocation: {
    backgroundColor: "orangered",
    alignItems: "center",
    justifyContent: "center",
    width: 205,
    height: 45,
    flexDirection: "row",
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonLocationContainer: {
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "orangered",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "flex-end",
    width: 115,
    height: 40,
    flexDirection: "row",
    borderRadius: 50,
    marginBottom: 10,
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
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 25,
    paddingRight: 15,
  },
  textData: {
    fontSize: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    paddingBottom: 5,
    color: ColorsApp.primaryTextColor,
  },
});

export default UserPublicationScreen;
