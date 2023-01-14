import React, { useState, useEffect } from "react";
import { ColorsApp } from "../constants/Colors";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo ,Ionicons} from "@expo/vector-icons";
import TraxpetHeader from "../components/Header";
import { getEspecies ,disabledEspecie} from "../services/SpecieService";

const SpeciesAdminScreen = () => {

  const navigation = useNavigation();
  const [especieValues, setEspecieValues] = useState([]);
  const [especieSeleccionada, setEspecieSeleccionada] = useState([]);
  const [showAlertConfirm, setShowAlertConfirm] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    getEspeciesData();
    disableEspecie();
  }, []);
  const getEspeciesData = async () => {
    const data = await getEspecies() ;

    setEspecieValues(data);

  };
  const disableEspecie = async () => {
    //console.log(this.state.especieSeleccionada)
    // disabledEspecie (especieSeleccionada);

    // this.getEspeciesData();

    // this.hideAlertConfirm();

    // setEspecieSeleccionada([""]);
  };
  
   const showAlertConfirms = (title, messsage) => {
        setShowAlertConfirm( true),
        setAlertTitle (title),
        setAlertMessage( messsage)
      };
    
   const  hideAlertConfirms = () => {
        setShowAlertConfirm( false);
      };

  let Item = ({ title }) => {
    return (
      <View style={styles.item}>
        {!title.deshabilitado ? (
          <Text >
            {" "}
            {title.nombre}
          </Text>
        ) : (
          <Text>
            {title.nombre + "\t\t\t(Deshabilitado)"}
          </Text>
        )}
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.buttonEdit}
            onPress={() => navigation.navigate
                  ("EditSpecieAdminScreen", {
                especie: title.nombre,
              })
            }
            
            
          >
            <Entypo name="pencil" size={24} color={ColorsApp.terciaryColor} />
          </TouchableOpacity>
          {!title.deshabilitado ? (
            <TouchableOpacity
              style={styles.buttonEdit}
              onPress={() => {
                setEspecieSeleccionada(title.nombre);
                  
                  showAlertConfirms(
                      "Confirmar cambios",
                      "¿Quiere confirmar los cambios realizados?",
                    );
              }}
            >
              <Entypo name="trash" size={24} color="indianred" />
            </TouchableOpacity>
          ) : (
            <View style={{ paddingEnd: 4, alignItems: "center" }}>
            </View>
          )}
        </View>
      </View>
    );
  };
  let renderItem = ({ item }) => {
    return <Item title={item} />;
  };

  return (
    <View>
       <TraxpetHeader/>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={especieValues.data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("NewSpecieAdminScreen")}
          >
            <Ionicons name="add-outline" size={34} color={ColorsApp.secondaryColor} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SpeciesAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsApp.primaryBackgroundColor,
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: 25,
  },
  item: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderColor: ColorsApp.primaryColor,
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
  buttonContainer: {
    width: 300,
    justifyContent: "flex-end",
    paddingBottom: 10,
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 20,
  },
  button: {
    backgroundColor: ColorsApp.primaryColor,
    borderRadius: 55,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
    margin: 8,
  },
  buttonEdit: {
    backgroundColor: ColorsApp.primaryBackgroundColor,
    borderRadius: 55,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
    marginLeft: 2,
    marginRight: 2,
  },
});
