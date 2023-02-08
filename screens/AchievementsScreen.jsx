import React from "react";
import Header from "../components/Header";
import { View, Text, StyleSheet } from "react-native";
import { niveles } from "./niveles";
import { usuario } from "./niveles";
import { FlashList } from "@shopify/flash-list";
import { ColorsApp } from "../constants/Colors";
import { Avatar } from "@rneui/themed";
import { Input,Icon } from "@rneui/themed";

const AchievementsScreen = () => {
  function Card({ nivel, premio }) {
    return (
      <View style={styles.singleItem}>
        <View style={styles.row}>
          <View style={styles.cardContent}>
            <Text style={styles.description}>Nivel {nivel}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.description}>Premio {premio}</Text>
          </View>
        </View>
      </View>
    );
  }
  const MyList = () => {
    return (
      <FlashList
        data={niveles}
        contentContainerStyle={{
          backgroundColor: ColorsApp.primaryBackgroundColor,
          paddingVertical: 50,
        }}
        renderItem={({ item }) => <Card {...item} />}
        estimatedItemSize={200}
        numColumns={1}
      />
    );
  };
  return (
    <View style={{ height: "100%" }}>
      <Header title="Logros" />
      <View>
     
            <Input
            style={styles.textInput}
            label="Estás en nivel 3"
            placeholder="Tus puntos : 800"
            placeholder2='Con 1.178 puntos más, subís de nivel'
            editable ={false} 
            labelStyle={{color: ColorsApp.primaryTextColor }}
            inputContainerStyle={{color: ColorsApp.primaryTextColor }}
            containerStyle={{color: ColorsApp.primaryTextColor}}
          />
      <Input
      label='Con 1.178 puntos más, subís de nivel'
      placeholder='Subí de nivel sumando puntos para conseguir más y mejores beneficios'
      editable ={false} 
     
    />
      
          </View>
      <MyList />
    </View>
  );
};
const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
  },

  singleItem: {
    margin: 8,
    padding: 8,
    minHeight: 44,
    flex: 1,
    borderWidth: 1,
    borderColor: ColorsApp.primaryColor,
    borderRadius: 10,
    backgroundColor: "ivory",
  },
  description: {
    fontSize: 14,
    color: ColorsApp.primaryTextColor,
  },
  row: {
    flexDirection: "row",
  },
  cardContent: {
    flexShrink: 1,
    flexGrow: 1,
  },
});
export default AchievementsScreen;
