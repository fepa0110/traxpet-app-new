import { React } from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";
import { ColorsApp } from "../constants/Colors";
import { Header } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const TraxpetHeaderHome = (props) => {
  const navigation = useNavigation();

  const goNotificationsScreen = () => {
    navigation.navigate("NotificationsScreen")
  }
  return (
    <View>
      <Header
        containerStyle={styles.headerContainer}
        centerComponent={
          <Image
            style={styles.traxpetLogo}
            source={require("../assets/traxpetBlack.png")}
          />
        }
        rightComponent={
          <TouchableOpacity
            onPress={goNotificationsScreen}
            style={styles.rightComponent}
          >
            <Ionicons
              name={
                props.notificaciones.length == 0
                  ? "notifications-outline"
                  : "notifications"
              }
              size={25}
              color={ColorsApp.naranjaClaro}
            />
            <Text style={styles.textNotification}>
              {props.notificaciones.length}
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rightComponent: { paddingTop: 10, flexDirection: "row" },
  headerContainer: {
    backgroundColor: ColorsApp.primaryColor,
    height: 60,
  },
  textNotification: {
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
