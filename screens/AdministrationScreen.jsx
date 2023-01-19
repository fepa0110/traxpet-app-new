import { Text, View, ScrollView,StyleSheet } from "react-native";
import React  from 'react'
import { ColorsApp } from '../constants/Colors';
import Header from '../components/Header';
import LargePrimaryButton from '../components/LargePrimaryButton'

const AdministrationScreen = ({ navigation }) => {
    return (
      <View style={{height:"100%"}}>
        <Header title="Menu administrador" />
        <View style={styles.container}>
          <View style={styles.buttonView}>
            <LargePrimaryButton
              title="Especie"
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
    }

export default AdministrationScreen

const styles = StyleSheet.create({
    container: {
      backgroundColor: ColorsApp.primaryBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
      height:"85%"
    },
    buttonView: {
      paddingVertical: 15, 
      // justifyContent: "center", 
    },
  });