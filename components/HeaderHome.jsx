import { React } from "react";
import { StyleSheet, Image } from "react-native";
import { ColorsApp } from "./Colors";
import { Header, Icon } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
const TraxpetHeaderHome = (props) => {
  return (
    <SafeAreaProvider>
      <Header
        containerStyle={styles.headerContainer}
        centerComponent={
          <Image
            style={styles.traxpetLogo}
            source={require("../assets/traxpetBlack.png")}
          />
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
  traxpetLogo: {
    width: 120,
    height: 50,
    resizeMode: "center",
  },
});
export default TraxpetHeaderHome;
