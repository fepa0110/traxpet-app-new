import React, { useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native'

import { Input, Divider} from "@rneui/themed";
import AwesomeAlert from "react-native-awesome-alerts";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Crypto from 'expo-crypto';

import { useNavigation } from '@react-navigation/native';

import { urlServer } from '../constants/constants'
import { ColorsApp } from "../constants/Colors";

import { useSelector, useDispatch } from 'react-redux'
import { logIn } from '../redux/slices/userSlice'

const LoginScreen = () => {
    const navigation = useNavigation();

    const [userValue, setUserValue] = useState("")
    const [userErrorMessage, setUserErrorMessage] = useState("")
    const [renderUserErrorMessage, setRenderUserErrorMessage] = useState(false)
    const [validUser, setValidUser] = useState(false)
    const [passwordValue, setPasswordValue] = useState("")
    const [validPassword, setValidPassword] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [renderPasswordErrorMessage, setRenderPasswordErrorMessage] = useState(false)
    const [showPassword, setShowPassword] = useState(true)
    const [showAlert, setShowAlert] = useState(false)
    const [alertTitle,setAlertTitle] = useState("")
    const [alertMessage,setAlertMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const user = useSelector((state)=> state.user.username)
    const dispatch = useDispatch()

    openAlert = (title, messsage) => {
        setShowAlert(true)
        setAlertTitle(title)
        setAlertMessage(messsage)
    };

    hideAlert = () => {
        setShowAlert(false)
    };

    togglePassword = () => {
        setShowPassword(!showPassword)
    }

    showErrorMessageUser = (message) => {
        setUserErrorMessage(message)
        setRenderUserErrorMessage(true)
    }

    hideErrorMessageUser = () => {
        setUserErrorMessage("")
        setRenderUserErrorMessage(false)
    }

    validateUserInput = (userValue) => {
        if (userValue === "") {
            showErrorMessageUser("No puede estar vacio")
            setValidUser(false)
        }
        else {
            setValidUser(true)
            hideErrorMessageUser()
        }

        setUserValue(userValue)
    }

    showErrorMessagePassword = (message) => {
        setPasswordErrorMessage(message)
        setRenderPasswordErrorMessage(true)
    }

    hideErrorMessagePassword = () => {
        setPasswordErrorMessage("")
        setRenderPasswordErrorMessage(false)
    }

    validatePasswordInput = (passwordValue) => {
        if (passwordValue === "") {
            showErrorMessagePassword("No puede estar vacio")
            setValidPassword(false)
        }
        else {
            setValidPassword(true)
            hideErrorMessagePassword()
        }

        setPasswordValue(passwordValue)
    }

    encryptPassword = async (password) => {
        return await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            password
        );
    }

    sendLogIn = async () => {
        setIsLoading(true)

        let encryptedPassword = await encryptPassword(passwordValue);

        let userData = {
            username: userValue,
            password: encryptedPassword
        }

        let responseLogIn = await fetch(urlServer + "/usuarios/login", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then((response) => {
                return response.json();
            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertTitle("Error")
                setAlertMessage("Se produjo un error al ingresar al sistema")
            });
        //Si se publico existosamente
        if (responseLogIn != null && responseLogIn.StatusCode == 200) {
            console.log(JSON.stringify(responseLogIn))
            setIsLoading(false)

            dispatch(logIn(responseLogIn.data.username))
            
            navigation.replace("HomeNavigation");
        }
        else if (responseLogIn != null && responseLogIn.StatusCode == 502) {
            setIsLoading(false)
            setShowAlert(true)
            setAlertTitle("Error")
            setAlertMessage(responseLogIn.StatusText)
        }
    };

    
    alerta = () => {
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

    loadingView = () => {
            return (
                <View>
                    <ActivityIndicator size={60} color={ColorsApp.primaryColor} />
                </View>
            );
    }

    loginScreen = () => {
        return (
            <View style={styles.inputsContainer}>
                <View style={styles.userInputContainer}>
                    <Input
                        style={styles.userInput}
                        placeholder='Usuario'
                        label="Usuario"
                        leftIcon={
                            <Icon
                                name='user'
                                size={22}
                                color={ColorsApp.primaryColor}
                                type="font-awesome-5"
                            />
                        }
                        errorStyle={{ color: 'red' }}
                        errorMessage={userErrorMessage}
                        renderErrorMessage={renderUserErrorMessage}
                        onChangeText={(userValue) => {
                            validateUserInput(userValue)
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
                            validatePasswordInput(passwordValue)
                        }}
                    />

                    <View style={styles.buttonsContainer}>
                        {/* Boton ingresar */}
                        <TouchableOpacity
                            style={styles.buttonIngresar}
                            onPress={() => {
                                sendLogIn()
                            }}
                            disabled={!(validUser && validPassword)}
                        >
                            <Text style={styles.buttonIngresarText}>Ingresar</Text>
                        </TouchableOpacity>

                        <Divider
                            orientation="horizontal"
                            color="#AAA"
                            width={1}
                            style={{ width: 150, paddingTop: 10 }}
                        />

                        {/* Boton registrarse */}
                        <TouchableOpacity
                            style={styles.buttonRegistrarse}
                            onPress={() => {
                                navigation.navigate("SignUpScreen");
                            }}
                        >
                            <Text style={styles.buttonRegistrarseText}>Registrarse</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Image
                    style={{
                        width: 240, height: 100, resizeMode: "center"
                    }}
                    source={
                        require('../assets/traxpetBlack.png')
                    }
                />
            </View>

            {isLoading ? loadingView() : loginScreen()}
            {alerta()}
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        top: -25,
        // paddingBottom: 75,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: ColorsApp.secondaryColor,
        alignItems: 'center',
    },
    inputsContainer: {
        width: 300,
        paddingBottom: 50
    },
    userInputContainer: {
        paddingBottom: 15
    },
    userInput: {
        padding: 10
    },
    passwordInputContainer: {
        paddingTop: 15
    },
    passwordInput: {
        padding: 10
    },
    buttonsContainer: {
        marginTop: 50,
        alignContent: "center",
        alignItems: "center"
    },
    buttonIngresar: {
        width: 250,
        height: 40,
        marginBottom: 5,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ColorsApp.primaryColor,
        borderWidth: 2,
        borderColor: ColorsApp.primaryColor,
        borderRadius: 100
    },
    buttonIngresarText: {
        color: ColorsApp.secondaryColor,
        fontSize: 16,
        fontWeight: "bold"
    },
    buttonRegistrarse: {
        width: 250,
        height: 40,
        marginTop: 15,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ColorsApp.secondaryColor,
        borderWidth: 2,
        borderColor: ColorsApp.primaryColor,
        borderRadius: 100
    },
    buttonRegistrarseText: {
        color: ColorsApp.primaryColor,
        fontSize: 16,
        fontWeight: "bold"
    }
});

export default LoginScreen