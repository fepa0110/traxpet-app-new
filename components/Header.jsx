/** Header 
 * Props:
 *  title: titulo del header
 *  rightComponent: Componente del lado derecho
 */

import { React } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ColorsApp } from "../constants/Colors";

import { Header as HeaderElements } from "@rneui/themed" ; 

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Header = (props) => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

/*   const setRightComponent = () => {
    if (props.isRefresh) {
      return (
        <TouchableOpacity onPress={() => props.rightFunction()}>
          <Ionicons
            name="refresh-outline"
            size={24}
            color={ColorsApp.primaryBackgroundColor}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }; */
  return (
    <View>
      <HeaderElements
        containerStyle={styles.headerContainer}
        leftComponent={
          <TouchableOpacity onPress={goBack}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={ColorsApp.primaryBackgroundColor}
            />
          </TouchableOpacity>
        }
        centerComponent={{
          text: props.title,
          style: styles.title,
        }}
        rightComponent={props.rightComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: ColorsApp.primaryColor,
    height: 60,
  },
  title: {
    flex: 2,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
export default Header;
