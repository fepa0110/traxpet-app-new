import { React } from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { ColorsApp } from "./Colors";
import { Header, Icon } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
const TraxpetHeader = (props) => {
  return (
    <SafeAreaProvider>
      <Header
        containerStyle={styles.headerContainer}
        leftComponent={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: props.title,
          style: styles.title,
        }}
        rightComponent={
          <TouchableOpacity onPress={() => props.rightFunction()}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
        }
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: ColorsApp.primaryColor,
    height: 65,
  },
  title: {
    flex: 2,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
export default TraxpetHeader;
