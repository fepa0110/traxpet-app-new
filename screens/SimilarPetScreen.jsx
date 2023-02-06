import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, Text } from "react-native";

import { Avatar, Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getPredictByPublication } from "../services/BoostingService";
import { getFeaturesMapByPredict } from "../services/ValueService";
import { getImagesByMascotaId, sendImage } from "../services/ImageService";

import {
  Provider as PaperProvider,
  DataTable,
  List,
  Portal,
  Card,
  Dialog,
  Avatar as AvatarPaper,
} from "react-native-paper";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import LoadingIndicator from "../components/LoadingIndicator";
import { ColorsApp } from "../constants/Colors";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import AwesomeAlert from "react-native-awesome-alerts";
import { addUbicacionMascota } from "../services/PublicationService";

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

  const [visibleModal, setVisibleModal] = useState(false);

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmFunction, setAlertConfirmFunction] = useState(()=>{})
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

  
  useEffect(() => {
    getPredict();
    // setMascotaSimilares(mockFeatures);
  },[publication]);

  const getPredict = async () => {
    let predict = await getPredictByPublication(publication);

    let idsPredict = predict.map((prediction) => {
      return prediction.id
    })

    let mapFeatures = await getFeaturesMapByPredict(idsPredict);

    predict = predict.map((prediction,index)=>{
      return {
        ...prediction,
        caracteristicas: mapFeatures.data[index],
      }
    })
    console.log("predict: ",predict[0]);
    setMascotaSimilares(predict);

    setIsLoading(false);
    // setMapaCaracteristicas(mapFeatures.data);
  };

  const sendSimilarSelected = async (mascotaId) => {
    if(publication.tipoPublicacion === "MASCOTA_ENCONTRADA"){
      showAlert("Actualizar ubicacion", "");

      // TODO: Cambiar ubicacion hardcodeada
      const ubicacion = {
        "latitude":0.5555555,
        "longitude": 0.5555555,
        "usuario": {
            "username": publication.usuario.username
        }
      }
      setAlertConfirmFunction(async ()=>{
        await addUbicacionMascota(ubicacion, mascotaId)
      })
    }
  }

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

  const showAlert = (title, messsage) => {
    setVisibleAlert(true);
    setAlertTitle(title);
    setAlertMessage(messsage);
  };

  const hideAlert = () => {
    setVisibleAlert(false);
  };

  const alert = () => {
    return(
      <AwesomeAlert
        show={visibleAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={ColorsApp.primaryColor}
        onConfirmPressed={()=>{
          hideAlert();
          alertConfirmFunction
        }}
      />
    )
  }

  const getImage = async (mascotaId) => {
    const image = await getImagesByMascotaId(mascotaId);
    setImageData(await image.data[0].ImagenData);
  };

  const showModal = () => {
    setVisibleModal(true);
  };
  const hideModal = () => setVisibleModal(false);

  const viewModal = () => {
    return (
      <PaperProvider>
        <View>
          <Portal>
            <Dialog visible={visibleModal} onDismiss={hideModal}>
              <Dialog.Content
                style={{
                  justifyContent: "center",
                  alignContent: "baseline",
                  alignItems: "center",
                }}
              >
                <AvatarPaper.Image
                  size={200}
                  source={{
                    uri: "data:image/jpg;base64," + imageData,
                  }}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <TouchableOpacity onPress={hideModal}>
                  <FontAwesome5
                    name="window-close"
                    size={25}
                    color={ColorsApp.primaryColor}
                  />
                </TouchableOpacity>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </PaperProvider>
    );
  };
  const accordionSubItem = (item) => {
    let subItems = [];
    const lista = publication.mascota.valores;
    const valores = item.caracteristicas;

    subItems.push(
      <List.Item
        title="Imagen"
        titleStyle={{ color: ColorsApp.primaryTextColor }}
        right={(props) => (
          <View
            style={{
              backgroundColor: ColorsApp.primaryBackgroundColor,
            }}
          >
            <Avatar
              size="small"
              rounded
              icon={{
                name: "image",
                type: "font-awesome",
                color: ColorsApp.primaryColor,
              }}
              overlayContainerStyle={{ borderColor: "gray" }}
              activeOpacity={0.7}
              containerStyle={styles.image}
              onPress={() => {
                getImage(item.id);
                showModal();
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
            <TouchableOpacity onPress={()=>{
              showAlert();
              setAlertConfirmFunction(()=>{
                sendSimilarSelected(item.id);
              })
            }}>
              <MaterialCommunityIcons
                name="cursor-pointer"
                size={24}
                color={ColorsApp.primaryColor}
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
                style={{
                  backgroundColor: ColorsApp.primaryBackgroundColor,
                }}
                titleStyle={{
                  fontWeight: "bold",
                  color: ColorsApp.primaryTextColor,
                }}
                key={item.id + item.probabilidad}
                title={item.id}
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
        <View style={{height: "100%"}}>
          <ScrollView
            style={{
              backgroundColor: ColorsApp.primaryBackgroundColor,
            }}
          >
            <DataTable key={"data-table-similar-pet-screen"}>
              {accordionItem()}
            </DataTable>
          </ScrollView>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(
              mascotasSimilares.length / numberOfItemsPerPage
            )}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} de ${mascotasSimilares.length}`}
            style={{ color: ColorsApp.primaryTextColor }}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={numberOfItemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            selectPageDropdownLabel={"elementos por pagina"}
          />
          {/* <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              color: ColorsApp.primaryTextColor,
            }}
          >
          </View> */}
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
        {viewModal()}
      </View>
    );
  };

  return (
    <View style={{ height: "100%" }}>
      {!isLoading ? showSimilarPetScreen() : <LoadingIndicator />}
      {alert()}
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    modal: {
      backgroundColor: ColorsApp.primaryBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
      width: 300,
      height: 300,
    },
    image: {
      width: 250,
      height: 250,
    },
    stretch: {
      width: 100,
      height: 200,
      resizeMode: "contain",
    },
  });
export default SimilarPetScreen;
