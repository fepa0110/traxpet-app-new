import React, { Component } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NewPublicationBasicDataScreen from "../screens/NewPublicationBasicDataScreen";
import MapScreen from "../screens/MapScreen";
import NewPublicationFeaturesScreen from "../screens/NewPublicationFeaturesScreen";
import ConfirmSelectedPet from "../screens/ConfirmSelectedPet";
import PetsScreen from "../screens/PetsScreen";

const PublicationStack = createNativeStackNavigator();

import { ColorsApp } from "../constants/Colors";

const PublicationNavigation = () => {
  return (
    <PublicationStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: ColorsApp.secondaryColor,
        headerStyle: {
          backgroundColor: ColorsApp.primaryColor,
        },
        contentStyle: {backgroundColor: ColorsApp.primaryBackgroundColor}
      }}
    >
      <PublicationStack.Screen
        name="PublicationBasicDataScreen"
        component={NewPublicationBasicDataScreen}
        initialParams={{
          location: {
            latitude: 0,
            longitude: 0,
          },
        }}
        options={{ title: "Nueva mascota" }}
      />
      <PublicationStack.Screen
        name="NewPublicationFeaturesScreen"
        component={NewPublicationFeaturesScreen}
        options={{ title: "Caracteristicas de mascota" }}
      />
      <PublicationStack.Screen name="MapScreen" component={MapScreen} />
      <PublicationStack.Screen
        name="PetsScreen"
        component={PetsScreen}
      />
      <PublicationStack.Screen
        name="ConfirmSelectedPet"
        component={ConfirmSelectedPet}
      />
    </PublicationStack.Navigator>
  );
};

export default PublicationNavigation;
