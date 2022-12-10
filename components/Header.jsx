import { React } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ColorsApp } from "../constants/Colors";
import { Header } from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
const TraxpetHeader = (props) => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View>
      <Header
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
        rightComponent={
          <TouchableOpacity onPress={() => props.rightFunction()}>
            <Ionicons
              name="refresh-outline"
              size={24}
              color={ColorsApp.primaryBackgroundColor}
            />
          </TouchableOpacity>
        }
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
export default TraxpetHeader;
