import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getPredictByPublication } from "../services/BoostingService";
import { getFeaturesMapByPredict } from "../services/ValueService";
import { sendImage } from "../services/ImageService";

import { Avatar } from "@rneui/themed";
import { Provider as PaperProvider, DataTable, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingIndicator from "../components/LoadingIndicator";
import { ColorsApp } from "../constants/Colors";
import Header from "../components/Header";

const mockFeatures = [
  {
    id: 1,
    probabilidad: 95,
    caracteristicas: [
      {
        id: 1,
        nombre: "Cachorro",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 1, nombre: "Edad" },
        deshabilitado: false,
      },
      {
        id: 4,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 2, nombre: "Tamaño" },
        deshabilitado: false,
      },
      {
        id: 7,
        nombre: "Macho",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 3, nombre: "Sexo" },
        deshabilitado: false,
      },
      {
        id: 10,
        nombre: "Liso",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 4, nombre: "Patron de pelaje" },
        deshabilitado: false,
      },
      {
        id: 14,
        nombre: "Blanco",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 5, nombre: "Color de pelaje 1" },
        deshabilitado: false,
      },
      {
        id: 26,
        nombre: "Corto",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 8, nombre: "Largo de pelaje" },
        deshabilitado: false,
      },
      {
        id: 41,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 12, nombre: "Largo de orejas" },
        deshabilitado: false,
      },
      {
        id: 44,
        nombre: "Paradas",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 13, nombre: "Tipo de orejas" },
        deshabilitado: false,
      },
    ],
  },
  {
    id: 2,
    probabilidad: 85,
    caracteristicas: [
      {
        id: 1,
        nombre: "Cachorro",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 1, nombre: "Edad" },
        deshabilitado: false,
      },
      {
        id: 4,
        nombre: "Grande",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 2, nombre: "Tamaño" },
        deshabilitado: false,
      },
      {
        id: 7,
        nombre: "Macho",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 3, nombre: "Sexo" },
        deshabilitado: false,
      },
      {
        id: 10,
        nombre: "Liso",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 4, nombre: "Patron de pelaje" },
        deshabilitado: false,
      },
      {
        id: 14,
        nombre: "Blanco",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 5, nombre: "Color de pelaje 1" },
        deshabilitado: false,
      },
      {
        id: 26,
        nombre: "Corto",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 8, nombre: "Largo de pelaje" },
        deshabilitado: false,
      },
      {
        id: 41,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 12, nombre: "Largo de orejas" },
        deshabilitado: false,
      },
      {
        id: 44,
        nombre: "Paradas",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 13, nombre: "Tipo de orejas" },
        deshabilitado: false,
      },
    ],
  },
  {
    id: 3,
    probabilidad: 75,
    caracteristicas: [
      {
        id: 1,
        nombre: "Cachorro",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 1, nombre: "Edad" },
        deshabilitado: false,
      },
      {
        id: 4,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 2, nombre: "Tamaño" },
        deshabilitado: false,
      },
      {
        id: 7,
        nombre: "Hembra",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 3, nombre: "Sexo" },
        deshabilitado: false,
      },
      {
        id: 10,
        nombre: "Liso",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 4, nombre: "Patron de pelaje" },
        deshabilitado: false,
      },
      {
        id: 14,
        nombre: "Blanco",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 5, nombre: "Color de pelaje 1" },
        deshabilitado: false,
      },
      {
        id: 26,
        nombre: "Corto",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 8, nombre: "Largo de pelaje" },
        deshabilitado: false,
      },
      {
        id: 41,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 12, nombre: "Largo de orejas" },
        deshabilitado: false,
      },
      {
        id: 44,
        nombre: "Paradas",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 13, nombre: "Tipo de orejas" },
        deshabilitado: false,
      },
    ],
  },
  {
    id: 4,
    probabilidad: 65,
    caracteristicas: [
      {
        id: 1,
        nombre: "Cachorro",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 1, nombre: "Edad" },
        deshabilitado: false,
      },
      {
        id: 4,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 2, nombre: "Tamaño" },
        deshabilitado: false,
      },
      {
        id: 7,
        nombre: "Macho",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 3, nombre: "Sexo" },
        deshabilitado: false,
      },
      {
        id: 10,
        nombre: "Liso",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 4, nombre: "Patron de pelaje" },
        deshabilitado: false,
      },
      {
        id: 14,
        nombre: "Blanco",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 5, nombre: "Color de pelaje 1" },
        deshabilitado: false,
      },
      {
        id: 26,
        nombre: "Corto",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 8, nombre: "Largo de pelaje" },
        deshabilitado: false,
      },
      {
        id: 41,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 12, nombre: "Largo de orejas" },
        deshabilitado: false,
      },
      {
        id: 44,
        nombre: "Paradas",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 13, nombre: "Tipo de orejas" },
        deshabilitado: false,
      },
    ],
  },
  {
    id: 5,
    probabilidad: 55,
    caracteristicas: [
      {
        id: 1,
        nombre: "Cachorro",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 1, nombre: "Edad" },
        deshabilitado: false,
      },
      {
        id: 4,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 2, nombre: "Tamaño" },
        deshabilitado: false,
      },
      {
        id: 7,
        nombre: "Macho",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 3, nombre: "Sexo" },
        deshabilitado: false,
      },
      {
        id: 10,
        nombre: "Liso",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 4, nombre: "Patron de pelaje" },
        deshabilitado: false,
      },
      {
        id: 14,
        nombre: "Blanco",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 5, nombre: "Color de pelaje 1" },
        deshabilitado: false,
      },
      {
        id: 26,
        nombre: "Corto",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 8, nombre: "Largo de pelaje" },
        deshabilitado: false,
      },
      {
        id: 41,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 12, nombre: "Largo de orejas" },
        deshabilitado: false,
      },
      {
        id: 44,
        nombre: "Paradas",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 13, nombre: "Tipo de orejas" },
        deshabilitado: false,
      },
    ],
  },
  {
    id: 6,
    probabilidad: 45,
    caracteristicas: [
      {
        id: 1,
        nombre: "Cachorro",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 1, nombre: "Edad" },
        deshabilitado: false,
      },
      {
        id: 4,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 2, nombre: "Tamaño" },
        deshabilitado: false,
      },
      {
        id: 7,
        nombre: "Macho",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 3, nombre: "Sexo" },
        deshabilitado: false,
      },
      {
        id: 10,
        nombre: "Liso",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 4, nombre: "Patron de pelaje" },
        deshabilitado: false,
      },
      {
        id: 14,
        nombre: "Blanco",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 5, nombre: "Color de pelaje 1" },
        deshabilitado: false,
      },
      {
        id: 26,
        nombre: "Corto",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 8, nombre: "Largo de pelaje" },
        deshabilitado: false,
      },
      {
        id: 41,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 12, nombre: "Largo de orejas" },
        deshabilitado: false,
      },
      {
        id: 44,
        nombre: "Paradas",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 13, nombre: "Tipo de orejas" },
        deshabilitado: false,
      },
    ],
  },
  {
    id: 7,
    probabilidad: 35,
    caracteristicas: [
      {
        id: 1,
        nombre: "Cachorro",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 1, nombre: "Edad" },
        deshabilitado: false,
      },
      {
        id: 4,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 2, nombre: "Tamaño" },
        deshabilitado: false,
      },
      {
        id: 7,
        nombre: "Macho",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 3, nombre: "Sexo" },
        deshabilitado: false,
      },
      {
        id: 10,
        nombre: "Liso",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 4, nombre: "Patron de pelaje" },
        deshabilitado: false,
      },
      {
        id: 14,
        nombre: "Blanco",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 5, nombre: "Color de pelaje 1" },
        deshabilitado: false,
      },
      {
        id: 26,
        nombre: "Corto",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 8, nombre: "Largo de pelaje" },
        deshabilitado: false,
      },
      {
        id: 41,
        nombre: "Mediano",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 12, nombre: "Largo de orejas" },
        deshabilitado: false,
      },
      {
        id: 44,
        nombre: "Paradas",
        especie: { id: 1, deshabilitado: false, nombre: "Perro" },
        caracteristica: { id: 13, nombre: "Tipo de orejas" },
        deshabilitado: false,
      },
    ],
  },
];

const SimilarPetScreen = () => {
  const navigation = useNavigation();
  const publication = useSelector((state) => state.newPublication).publication;
  const images = useSelector((state) => state.newPublication).images;
  const [isLoading, setIsLoading] = useState(false);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [mascotasSimilares, setMascotaSimilares] = useState([]);

  const [imageData, setImageData] = useState("");
  const [mapaCaracteristicas, setMapaCaracteristicas] = useState([]);

  const numberOfItemsPerPageList = [5, 10, 20, 50];
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min(
    (page + 1) * numberOfItemsPerPage,
    mascotasSimilares.length
  );

  const getPredict = async () => {
    let predict = await getPredictByPublication(publication);
    let mapFeatures = await getFeaturesMapByPredict(predict);
    setIsLoading(false);
    setMascotaSimilares(predict);
    setMapaCaracteristicas(mapFeatures);
  };

  const sendPublication = async () => {
    setIsLoading(true);
    const publicationData = await sendPublication(publication);
    //Si se publico existosamente
    if (publicationData != null && publicationData.StatusCode == 200) {
      images.map((image) => {
        sendImage(image, publicationData.data.mascota.id);
      });
      navigation.navigate("Home");
    } else {
      setIsLoading(false);
      showAlert("Error", "Se produjo un error al generar la publicación");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    //getPredict();
    setMascotaSimilares(mockFeatures);
  });

  const showAlert = (title, messsage) => {
    setVisibleAlert(true);
    setAlertTitle(title);
    setAlertMessage(messsage);
  };

  const hideAlert = () => {
    setVisibleAlert(false);
  };

  const accordionSubItem = (item) => {
    let subItems = [];
    const lista = publication.mascota.valores;
    const valores = item.caracteristicas;

    subItems.push(
      <List.Item
        title="Imagen"
        right={(props) => (
          <View style={{ marginRight: 9 }}>
            <Avatar
              size={40}
              rounded
              icon={{ name: "image", type: "material", color: "#009688" }}
              onPress={() => {
                this.props.navigation.navigate("ViewImageSimilar", {
                  mascotaId: mascotaId,
                });
              }}
            />
          </View>
        )}
        key={item.id}
      />
    );

    for (let index = 0; index < lista.length; index++) {
      let finded = valores.find(
        (value) =>
          value.caracteristica.nombre.normalize() ===
          lista[index].nombre.normalize()
      );
      subItems.push(
        <List.Item
          title={
            lista[index].nombre +
            ":   \t\t" +
            lista[index].caracteristica.nombre
          }
          right={(props) => (
            <List.Icon
              {...props}
              color={
                finded == undefined ||
                finded.nombre.normalize() !==
                  lista[index].caracteristica.nombre.normalize()
                  ? "red"
                  : "blue"
              }
              icon={
                finded == undefined ||
                finded.nombre.normalize() !==
                  lista[index].caracteristica.nombre.normalize()
                  ? "close"
                  : "check-all"
              }
            />
          )}
          key={item.id + "-" + index}
        />
      );
    }
    return subItems;
  };

  const accordionItem = () => {
    const itemData = [];
    mascotasSimilares
      .slice(
        page * numberOfItemsPerPage,
        page * numberOfItemsPerPage + numberOfItemsPerPage
      )
      .map((item) => {
        itemData.push(
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              backgroundColor: ColorsApp.primaryBackgroundColor,
            }}
            key={item.id + item.probabilidad}
          >
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="cursor-pointer"
                size={24}
                color="black"
                backgroundColor={ColorsApp.primaryBackgroundColor}
              />
            </TouchableOpacity>
            <View
              key={item.id + item.probabilidad}
              style={{
                width: "98%",
                backgroundColor: ColorsApp.primaryBackgroundColor,
              }}
            >
              <List.Accordion
                key={item.id + item.probabilidad}
                title={item.probabilidad}
              >
                {accordionSubItem(item)}
              </List.Accordion>
            </View>
          </View>
        );
      });
    return <List.Section key="List Section">{itemData}</List.Section>;
  };

  const showAccordionList = () => {
    return (
      <PaperProvider>
        <ScrollView
          style={{
            backgroundColor: ColorsApp.primaryBackgroundColor,
            height: "100%",
          }}
        >
          <DataTable key={"data-table-similar-pet-screen"}>
            {accordionItem()}
          </DataTable>
        </ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(
              mascotasSimilares.length / numberOfItemsPerPage
            )}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} de ${mascotasSimilares.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={numberOfItemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            selectPageDropdownLabel={"elementos por pagina"}
          />
        </View>
      </PaperProvider>
    );
  };
  const showSimilarPetScreen = () => {
    return (
      <View
        style={{
          backgroundColor: ColorsApp.primaryBackgroundColor,
          height: "100%",
        }}
      >
        <Header title="Mascotas similares" />
        {showAccordionList()}
      </View>
    );
  };

  return (
    <View style={{ height: "100%" }}>
      {!isLoading ? showSimilarPetScreen() : <LoadingIndicator />}
    </View>
  );
};

export default SimilarPetScreen;
