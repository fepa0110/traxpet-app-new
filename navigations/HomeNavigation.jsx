import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

import UserScreen from "../screens/UserScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";

import { Ionicons } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ColorsApp } from "../constants/Colors";

const Tab = createBottomTabNavigator();

const HomeNavigation = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "PublicationScreen") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (route.name === "User Profile") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: ColorsApp.primaryColor,
          tabBarInactiveTintColor: "#404040",
          tabBarShowLabel: Platform.OS == "android" ? false : true,
          headerShown: false,
        })}
        sceneContainerStyle={{
          backgroundColor: ColorsApp.primaryBackgroundColor,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: "Buscar" }}
        />
        <Tab.Screen
          name="User Profile"
          component={UserScreen}
          options={{ title: "Perfil de usuario" }}
        />
      </Tab.Navigator>
  );
};

export default HomeNavigation;
