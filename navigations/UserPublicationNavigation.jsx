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
            }}
        >
            <UserPublicationStack.Screen
                name="ListPublicationScreen"
                component={ListPublicationScreen}
            />

            <UserPublicationStack.Screen
                name="UserPublicationScreen"
                component={UserPublicationScreen}
            />

            <UserPublicationStack.Screen
                name="EditPublicationScreen"
                component={EditPublicationScreen}
            />
            <UserPublicationStack.Screen
                name="LocationEditWebScreen"
                component={LocationEditWebScreen}
            />
            <UserPublicationStack.Screen
                name="LocationEditScreen"
                component={LocationEditScreen}
            />

        </UserPublicationStack.Navigator>

    );
};

export default UserPublicationNavigation;