import { React } from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";
import { ColorsApp } from "../constants/Colors";
import { Header } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const HeaderHome = (props) => {
  return (
    <View>
      <Header
        containerStyle={styles.headerContainer}
        leftComponent={
          <Image
            style={styles.traxpetLogo}
            source={require("../assets/traxpetBlack.png")}
          />
        }
        rightComponent={
          <TouchableOpacity
            onPress={props.onPressNotifications}
            style={styles.rightComponent}
          >
            <Ionicons
              name={
                props.amountNotifications == 0
                  ? "notifications-outline"
                  : "notifications"
              }
              size={25}
              color={ColorsApp.naranjaClaro}
            />
            <Text style={styles.textNotification}>
              {props.amountNotifications}
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
    backgroundColor: ColorsApp.primaryBackgroundColor,
    height: 70,
  },
  textNotification: {
    flex: 2,
    fontSize: 18,
    color: ColorsApp.primaryColor,
    fontWeight: "bold",
  },
  traxpetLogo: {
    width: 120,
    height: 50,
    resizeMode: "center",
  },
});
export default HeaderHome;
