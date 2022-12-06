import React from "react";

import AdministrationScreen from "../screens/AdministrationScreen";
import SpeciesAdminScreen from "../screens/SpeciesAdminScreen";
import FeaturesAdminScreen from "../screens/FeaturesAdminScreen";
import NewFeatureAdminScreen from "../screens/NewFeatureAdminScreen";
import NewSpecieAdminScreen from "../screens/NewSpecieAdminScreen";
import EditSpecieAdminScreen from "../screens/EditSpecieAdminScreen";
import EditFeatureAdminScreen from "../screens/EditFeatureAdminScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AdminScreenStack = createNativeStackNavigator();

const AdminNavigation = () => {
    return (
        <AdminScreenStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <AdminScreenStack.Screen
                name="AdministrationScreen"
                component={AdministrationScreen}
                options={{ title: "Menu De Administracion" }}
            />

            <AdminScreenStack.Screen
                name="SpeciesAdminScreen"
                component={SpeciesAdminScreen}
                options={{ title: "Especies" }}
            />
            <AdminScreenStack.Screen
                name="FeaturesAdminScreen"
                component={FeaturesAdminScreen}
                options={{ title: "Caracteristicas" }}
            />
            <AdminScreenStack.Screen
                name="NewFeatureAdminScreen"
                component={NewFeatureAdminScreen}
                options={{ title: "Nueva caracteristica" }}
            />
            <AdminScreenStack.Screen
                name="NewSpecieAdminScreen"
                component={NewSpecieAdminScreen}
                options={{ title: "Nueva especie" }}
            />
            <AdminScreenStack.Screen
                name="EditSpecieAdminScreen"
                component={EditSpecieAdminScreen}
                options={{ title: "Editar especie" }}
            />
            <AdminScreenStack.Screen
                name="EditFeatureAdminScreen"
                component={EditFeatureAdminScreen}
                options={{ title: "Editar caracteristica" }}
            />
        </AdminScreenStack.Navigator>
    );
};

export default AdminNavigation;