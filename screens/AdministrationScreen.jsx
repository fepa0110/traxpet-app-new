import { Text, View, TouchableOpacity,StyleSheet } from "react-native";
import React  from 'react'
import { ColorsApp } from '../constants/Colors';
import { Header } from "@rneui/themed";
import { Entypo} from "@expo/vector-icons";

const AdministrationScreen = ({ navigation }) => {
    return (
  
        <View>
           <Header
          containerStyle={{
            backgroundColor: ColorsApp.primaryBackgroundColor,
            justifyContent: "space-around",
            height: 65,
          }}
          leftComponent={
            <TouchableOpacity
              onPress={() => navigation.navigate("UserScreen")}
            >
          <Entypo name="chevron-left" size={24} color={ColorsApp.secondaryColor}/>
            </TouchableOpacity>
          }
          centerComponent={{
            text: "Menu de administracion",
            style: { fontSize: 18, color: ColorsApp.primaryTextColor, fontWeight: "bold" },
          }}
          rightComponent={{}}
        />

       
        <View style>
          <View
            style={{
              paddingTop: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.buttonText }
              onPress={() =>  navigation.navigate("SpeciesAdminScreen")}
            >
              <Text style ={
                {color:ColorsApp.primaryTextColor}
              }>
                Especie</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonText }
              onPress={() =>  navigation.navigate("FeaturesAdminScreen")}
            >
              <Text style ={
                {color:ColorsApp.primaryTextColor}
              }>
                Caracteristicas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      );
    }
  
  

export default AdministrationScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      backgroundColor: "orangered",
      alignItems: "center",
      justifyContent: "center",
      width: 205,
      height: 45,
      flexDirection: "row",
      margin: 10,
    },
    buttonView: {
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
  });