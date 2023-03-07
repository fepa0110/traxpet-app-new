import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListPublicationScreen from "../screens/ListPublicationScreen";
import UserPublicationScreen from "../screens/UserPublicationScreen";
import EditPublicationScreen from "../screens/EditPublicationScreen";
import LocationEditWebScreen from "../screens/LocationEditWebScreen";
import LocationEditScreen from "../screens/LocationEditScreen";

import { ColorsApp } from "../constants/Colors";

const UserPublicationStack = createNativeStackNavigator();

const UserPublicationNavigation = () => {
  return (
    <UserPublicationStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: ColorsApp.secondaryColor,
        headerStyle: {
          backgroundColor: ColorsApp.primaryColor,
        },
        contentStyle: {backgroundColor: ColorsApp.primaryBackgroundColor}
      }}
    >
      <UserPublicationStack.Screen
        name="UserPublicationScreen"
        component={UserPublicationScreen}
        options={{ title: "Ver publicacion",  }}
      />

      <UserPublicationStack.Screen
        name="EditPublicationScreen"
        component={EditPublicationScreen}
        options={{ title: "Editar publicacion",  }}
      />
      <UserPublicationStack.Screen
        name="LocationEditWebScreen"
        component={LocationEditWebScreen}
        options={{ title: "Editar ubicacion",  }}
      />
      <UserPublicationStack.Screen
        name="LocationEditScreen"
        component={LocationEditScreen}
        options={{ title: "Editar ubicacion",  }}
      />
    </UserPublicationStack.Navigator>
  );
};

export default UserPublicationNavigation;
