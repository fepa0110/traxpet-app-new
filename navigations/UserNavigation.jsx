import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

import AchievementsScreen from "../screens/AchievementsScreen";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ColorsApp } from "../constants/Colors";

const UserStack = createNativeStackNavigator();

const UserNavigation = () => {
  return(
    <UserStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: ColorsApp.secondaryColor,
        headerStyle: {
          backgroundColor: ColorsApp.primaryColor,
        },
        contentStyle: {backgroundColor: ColorsApp.primaryBackgroundColor}
      }}
    >
    <UserStack.Screen
    name="AchievementsScreen"
    component={AchievementsScreen}
  />
  </UserStack.Navigator>

  )}

export default UserNavigation;