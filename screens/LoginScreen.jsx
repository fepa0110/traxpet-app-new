import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
} from "react-native";

import { Input, Divider } from "@rneui/themed";
import AwesomeAlert from "react-native-awesome-alerts";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Crypto from "expo-crypto";

import { useNavigation } from "@react-navigation/native";

import { urlServer } from "../constants/constants";
import { ColorsApp } from "../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../redux/slices/userSlice";

import validator from 'validator'

import LoadingIndicator from "../components/LoadingIndicator";
import LargePrimaryButton from "../components/LargePrimaryButton";
import LargeSecondaryButton from "../components/LargeSecondaryButton";
import { loginRequest } from "../services/UsuarioService";

const LoginScreen = () => {
    const navigation = useNavigation();

    const [userValue, setUserValue] = useState("");
    const [userErrorMessage, setUserErrorMessage] = useState("");
    const [renderUserErrorMessage, setRenderUserErrorMessage] = useState(false);
    const [validUser, setValidUser] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [renderPasswordErrorMessage, setRenderPasswordErrorMessage] =
        useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state) => state.user.username);
    const dispatch = useDispatch();

    const openAlert = (title, messsage) => {
        setShowAlert(true);
        setAlertTitle(title);
        setAlertMessage(messsage);
    };

    const hideAlert = () => {
        setShowAlert(false);
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const showErrorMessageUser = (message) => {
        setUserErrorMessage(message);
        setRenderUserErrorMessage(true);
    };

    const hideErrorMessageUser = () => {
        setUserErrorMessage("");
        setRenderUserErrorMessage(false);
    };

    const validateUserInput = (userValue) => {
        if (validator.isEmpty(userValue)) {
            showErrorMessageUser("No puede estar vacio");
            setValidUser(false);
        } 
        else {
            setValidUser(true);
            hideErrorMessageUser();
        }

        setUserValue(userValue);
    };

    const showErrorMessagePassword = (message) => {
        setPasswordErrorMessage(message);
        setRenderPasswordErrorMessage(true);
    };

    const hideErrorMessagePassword = () => {
        setPasswordErrorMessage("");
        setRenderPasswordErrorMessage(false);
    };

    const validatePasswordInput = (passwordValue) => {
        if (validator.isEmpty(passwordValue)) {
            showErrorMessagePassword("No puede estar vacio");
            setValidPassword(false);
        } 
        else {
            setValidPassword(true);
            hideErrorMessagePassword();
        }

        setPasswordValue(passwordValue);
    };
    
    const encryptPassword = async (password) => {
        return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        password
        );
    };

    const sendLogIn = async () => {
        setIsLoading(true);

        let encryptedPassword = await encryptPassword(passwordValue);

        let userData = {
            username: userValue,
            password: encryptedPassword,
        };

        let responseLogIn = await loginRequest(userData);

        //Si se logueo existosamente
        if (responseLogIn != null && responseLogIn.StatusCode == 200) {
        console.log(JSON.stringify(responseLogIn));
        setIsLoading(false);

        dispatch(logIn({ 
                id: responseLogIn.data.id, 
                username: responseLogIn.data.username
            }
        ));

        navigation.replace("HomeNavigation");
        } 
        else if (responseLogIn != null && responseLogIn.StatusCode == 502) {
        setIsLoading(false);
        setShowAlert(true);
        setAlertTitle("Error");
        setAlertMessage(responseLogIn.StatusText);
        }
    };

    const alerta = () => {
        return (
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={alertTitle}
            message={alertMessage}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Aceptar"
            confirmButtonColor={ColorsApp.primaryColor}
            onConfirmPressed={() => {
            hideAlert();
            }} 
        />
        );
    };

    const loginScreen = () => {
        return (
        <View style={styles.inputsContainer}>
            <View style={styles.userInputContainer}>
                <Input
                    style={styles.userInput}
                    placeholder="Usuario"
                    label="Usuario"
                    leftIcon={
                    <Icon
                        name="user"
                        size={22}
                        color={ColorsApp.primaryColor}
                        type="font-awesome-5"
                    />
                    }
                    errorStyle={{ color: "red" }}
                    errorMessage={userErrorMessage}
                    renderErrorMessage={renderUserErrorMessage}
                    onChangeText={(userValue) => {
                    validateUserInput(userValue);
                    }}
                />
            </View>

            <View style={styles.passwordInputContainer}>
                <Input
                    style={styles.passwordInput}
                    placeholder="Contraseña"
                    label="Contraseña"
                    leftIcon={
                    <Icon
                        type="font-awesome-5"
                        name="lock"
                        size={22}
                        color={ColorsApp.primaryColor}
                    />
                    }
                    rightIcon={
                    <Icon
                        type="entypo"
                        name={showPassword ? "eye" : "eye-slash"}
                        size={20}
                        color={ColorsApp.primaryColor}
                        onPress={togglePassword}
                    />
                    }
                    errorMessage={passwordErrorMessage}
                    renderErrorMessage={renderPasswordErrorMessage}
                    secureTextEntry={showPassword}
                    onChangeText={(passwordValue) => {
                    validatePasswordInput(passwordValue);
                    }}
                />
            </View>
            
            <View style={styles.buttonsContainer}>
                {/* Boton ingresar */}
                <LargePrimaryButton 
                    title="Ingresar" 
                    actionFunction={() => { sendLogIn() }}
                    disabled={!(validUser && validPassword)}/>

                <Divider
                orientation="horizontal"
                color="#AAA"
                width={1}
                style={{ width: 150, marginVertical:15}}
                />

                {/* Boton registrarse */}
                <LargeSecondaryButton 
                    title="Registrarse" 
                    actionFunction={() => {
                        navigation.navigate("SignUpScreen")}
                    }
                />

            </View>
        </View>
        );
    };

    return (
        <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Image
            style={{
                width: 240,
                height: 100,
                resizeMode: "center",
            }}
            source={require("../assets/traxpetBlack.png")}
            />
        </View>

        {isLoading ? <LoadingIndicator /> : loginScreen()}
        {alerta()}
        </View>
    );
    };

const styles = StyleSheet.create({
    titleContainer: {
        marginTop:'5%'
    },
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: ColorsApp.primaryBackgroundColor,
        alignItems: "center",
    },
    inputsContainer: {
        width: 300,
        paddingBottom: 50,
    },
    userInputContainer: {
        paddingBottom: 15,
    },
    userInput: {
        padding: 10,
    },
    passwordInputContainer: {
        paddingTop: 15,
    },
    passwordInput: {
        padding: 10,
    },
    buttonsContainer: {
        marginTop: 50,
        alignContent: "center",
        alignItems: "center",
    },
});

export default LoginScreen;
