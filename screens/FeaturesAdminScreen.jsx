import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { ColorsApp } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { getFeatures } from "../services/FeatureService";
import Header from "../components/Header";
import Separator from "../components/Separator";
import { FlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";
import FloatingButton from "../components/FloatingButton";

const FeaturesAdminScreen = () => {
  const navigation = useNavigation();
  const [featuresValues, setFeaturesValues] = useState();

  useEffect(() => {
    getFeatureData();
  });
  const getFeatureData = async () => {
    const features = await getFeatures();

    setFeaturesValues(features.data);
  };

  const listEmpty = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No hay Caracteristicas</Text>
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

    
    </View>
  );
  return (
    <View style={{ height: "100%" }} >
      <Header title={"Caracteristica"} />

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
      <FloatingButton
        visible={true}
        onPressFunction={() => {
          navigation.navigate("NewFeatureAdminScreen")
        }}
      />
    </View>
  );
};

export default FeaturesAdminScreen;

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
  },
  
});
