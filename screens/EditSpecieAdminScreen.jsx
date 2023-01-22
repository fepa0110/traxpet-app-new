import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
// import { Header } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";

import { useNavigation, useRoute } from "@react-navigation/native";

import { getFeatures } from "../services/FeatureService";

import { ColorsApp } from "../constants/Colors";
import Header from "../components/Header";
import Separator from "../components/Separator";

const EditSpecieAdminScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { especie } = route.params;

  const [featuresValues, setFeaturesValues] = useState("");
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertConfirm, setShowAlertConfirm] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    getFeaturesData();
  }, []);

  const getFeaturesData = async () => {
    const features = await getFeatures();

    setFeaturesValues(features.data);
  };

  const showAlertErrors = (messsage) => {
    setShowAlertError(true), setAlertMessage(messsage);
  };

  const showAlertConfirms = (title, messsage) => {
    setShowAlertConfirm(true), setAlertTitle(title), setAlertMessage(messsage);
  };

  const hideAlert = () => {
    setShowAlertError(false), setSaveAlert(false), setShowAlertConfirm(false);
  };

  const listEmpty = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No hay especies</Text>
        <FontAwesome5
          name="frown-open"
          size={32}
          color={ColorsApp.primaryColor}
        />
      </View>
    );
  };

  const itemDivider = () => {
    return (
      <View style={{ alignItems: "center", height: "100%" }}>
        <Separator width="50%" />
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FontAwesome5
          name="angle-right"
          size={20}
          color={ColorsApp.primaryColor}
        />
        <Text style={styles.itemTitle}>{item.nombre}</Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("EditFeatureAdminScreen", {
              especie: especie,
              caracteristica: item.nombre,
            });
          }}
        >
          <FontAwesome5
            name="pencil-alt"
            size={20}
            color={ColorsApp.primaryColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ height: "100%" }}>
      <Header title={"Editar " + especie.nombre} />
      <ScrollView style={styles.container}>
        <FlashList
          contentContainerStyle={{ paddingVertical: 20 }}
          data={featuresValues}
          renderItem={renderItem}
          estimatedItemSize={10}
          ListEmptyComponent={listEmpty}
          ItemSeparatorComponent={itemDivider}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    height: "100%",
    width: "75%",
    alignSelf: "center",
  },
  message: { 
    fontWeight: "bold", 
    fontSize: 16, 
    padding: 5
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: ColorsApp.primaryTextColor
  },
});

export default EditSpecieAdminScreen;
