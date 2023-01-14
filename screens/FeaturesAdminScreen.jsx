import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { ColorsApp } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@rneui/themed";
import { Entypo ,EvilIcons,Ionicons} from '@expo/vector-icons'; 
import { getCaracteristicas} from "../services/CaracteristicaService";

const FeaturesAdminScreen = () => {
  const navigation = useNavigation();
  const [ caracteristicasValues, setCaracteristicasValues] = useState();
  const [selectedEspecieValue, setSelectedEspecieValue] = useState("");

  useEffect(() => {
    getCaracteristicasData();
  });
  const getCaracteristicasData = async () => {
    const data = await getCaracteristicas() ;
    
    setCaracteristicasValues( data  );
    
   // return setCaracteristicasValues.data;
  }

    

  let Item = ({ title }) => {
    return (
      <View style={styles.item}>
        <Text > {title}</Text>
      </View>
    );
  };
  let renderItem = ({ item }) => {
    return <Item title={item.nombre} />;
  };

  return (
    <View>
      <Header
        containerStyle={{
          backgroundColor: "orangered",
          justifyContent: "space-around",
          height: 65,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo
              name="chevron-left"
              size={24}
              
              
              export default FeaturesAdminScreen
              color={ColorsApp.secondaryColor}
              style={{ paddingRight: 5 }}

            />
         
          </TouchableOpacity>
        }
        centerComponent={{
          text: "Caracteristicas",
          style: { fontSize: 18, color: "#fff", fontWeight: "bold" },
        }}
        rightComponent={
          <TouchableOpacity
          //   onPress={() => this.getCaracteristicasData()}
          >
            <EvilIcons name="redo" size={24} color= {ColorsApp.secondaryColor}/>
           
          </TouchableOpacity>
        }
      />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={caracteristicasValues}
          renderItem={renderItem}
          keyExtractor={(item) => item.nombre}        
          
       />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("NewFeatureAdminScreen")}
          >
            <Ionicons name="add-outline" size={34} color={ColorsApp.secondaryColor} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FeaturesAdminScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    backgroundColor: "white",
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderColor: "orangered",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "space-between",
    width: 350,
    height: 45,
    flexDirection: "row",
    paddingLeft: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  title: {
    color:"black",
    fontSize: 32,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    paddingBottom: 10,
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 20,
  },
  button: {
    backgroundColor: "orangered",
    borderRadius: 55,
    alignContent: "center",
    alignItems: "center",
    width: 52,
    height: 52,
    margin: 8,
  },
  buttonBack: {
    backgroundColor: "orangered",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "flex-end",
    width: 115,
    height: 40,
    flexDirection: "row-reverse",
    borderRadius: 50,
    margin: 10,
  },
  viewOptionsContainer: {
    alignItems: "center",
    padding: 10,
  },
  pickerView: {
    alignItems: "center",
    width: 250,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
});
