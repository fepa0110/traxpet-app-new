import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons ,Entypo} from '@expo/vector-icons'; 
import { Header } from "@rneui/themed";
import {getCaracteristicas} from "../services/CaracteristicaService"
import { ColorsApp } from "../constants/Colors";
import { useNavigation ,useRoute} from "@react-navigation/native";

const EditSpecieAdminScreen = () => {

      const route = useRoute();
      const navigation = useNavigation();
      const [featuresValues, setFeaturesValues] = useState("")        
      const [values, setValues] = useState([])
      const [showAlertError, setShowAlertError] = useState(false)
      const [showAlertConfirm, setShowAlertConfirm] = useState("")
      const [especieExist, setEspecieExist] = useState("")
      const [alertTitle, setAlertTitle] = useState("")
      const [alertMessage, setAlertMessage] = useState("")
      const [refreshList, setFefreshList] = useState(false)
      const [newFeatureValue, setNewFeatureValue] = useState("")
      const { especie } = useState(route.params.SpecieAdminScreen);


      useEffect(() => {
        getFeaturesData();
  
      }, []);


 const getFeaturesData = async () => {
    const data = await getCaracteristicas() ;
  
    setFeaturesValues( data.data  );
  };

  const showAlertErrors = (messsage) => {
   
    setShowAlertError(true),
    setAlertMessage( messsage)
};

const showAlertConfirms = (title, messsage) => {

    setShowAlertConfirm( true),
    setAlertTitle(title),
    setAlertMessage(messsage) 
     };

const hideAlert = () => {
    setShowAlertError(false),
    setSaveAlert(false),
    setShowAlertConfirm(false)
};

  
    let Item = ({ title }) => {
      return (
        <View style={styles.item}>
          <Text> {title}</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={ styles.buttonEdit}
              onPress={() => {
                navigation.navigate("EditFeatureAdminScreen", {
                  especie:especie,
                  caracteristica: title,
                });
              }}
            >
              <Ionicons name="pencil-sharp" size={24}  
              color={ColorsApp.terciaryColor} />
            </TouchableOpacity>
          </View>
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
            backgroundColor: ColorsApp.primaryColor,
            justifyContent: "space-around",
            height: 65,
          }}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={24} color={ColorsApp.secondaryColor}/>
            </TouchableOpacity>
          }
          centerComponent={{
            text: "Editar Especie",
            style: {
              fontSize: 18,
              color: ColorsApp.secondaryColor,
              fontWeight: "bold",
            },
          }}
          rightComponent={{}}
        />
        <View style={styles.container}>
          <Text style={{ fontWeight: "bold", fontSize: 22, margin: 5 }}>
            Especie: {especie}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, margin: 5 }}>
            Caracteristicas
          </Text>

          <FlatList
            data={featuresValues}
            renderItem={renderItem}
            keyExtractor={(item) => item.nombre}
            extraData={refreshList}
          />
        </View>
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingBottom: 20,
  },
  viewOptionsContainer: {
    alignItems: "center",
    padding: 10,
  },
  textInput: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 40,
    width: 250,
    borderColor: "gray",
    borderWidth: 1,
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
    fontSize: 32,
  },

  button: {
    backgroundColor: "orangered",
    borderRadius: 25,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row-reverse",
    width: 115,
    height: 40,
  },
  buttonEdit: {
    backgroundColor: "white",
    borderRadius: 55,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
    marginLeft: 2,
    marginRight: 2,
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
  pickerView: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: 350,
    height: 40,
    marginTop: 20,
  },
});

export default EditSpecieAdminScreen;
