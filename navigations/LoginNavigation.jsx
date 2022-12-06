import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen  from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";

const LoginScreenStack = createNativeStackNavigator();

const LoginNavigation = () => {
    return (
        <LoginScreenStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <LoginScreenStack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ title: "Login" }}
            />
            <LoginScreenStack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{ title: "SignUp" }}
            />
        </LoginScreenStack.Navigator>
    );
};

export default LoginNavigation;