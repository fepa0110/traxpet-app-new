import { Text, View, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { ColorsApp } from "constants/Colors";
import Header from "@/Header";
import LargePrimaryButton from "@/LargePrimaryButton";
import { useNavigation } from "@react-navigation/native";

const AdministrationScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ height: "100%" }}>
      <Header title="Menu administrador" />
      <View style={styles.container}>
        <View style={styles.buttonView}>
          <LargePrimaryButton
            title="Especies"
            actionFunction={() => {
              navigation.navigate("SpeciesAdminScreen");
            }}
          />
        </View>
        <View style={styles.buttonView}>
          <LargePrimaryButton
            title="Caracteristicas"
            actionFunction={() => {
              navigation.navigate("FeaturesAdminScreen");
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AdministrationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
    height: "85%",
  },
  buttonView: {
    paddingVertical: 15,
  },
});
