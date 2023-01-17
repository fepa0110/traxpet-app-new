import { StyleSheet, 
    Text, 
    Image, 
    View , 
    TouchableOpacity} from 'react-native'
import React, { useState } from 'react'

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
import LargePrimaryButton from '../components/LargePrimaryButton';
import LoadingIndicator from '../components/LoadingIndicator';
import LargeSecondaryButton from '../components/LargeSecondaryButton';
import { getUserByEmailRequest, getUserByUsernameRequest, registerUserRequest } from '../services/UsuarioService';
import Separator from '../components/Separator';

const SignUpScreen = () => {
    const navigation = useNavigation();

    const [userValue, setUserValue] = useState("");
    const [userErrorMessage, setUserErrorMessage] = useState("");
    const [renderUserErrorMessage, setRenderUserErrorMessage] = useState(false);
    const [validUser, setValidUser] = useState(false);

    const [emailValue, setEmailValue] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [renderEmailErrorMessage, setRenderEmailErrorMessage] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    const [passwordValue, setPasswordValue] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [renderPasswordErrorMessage, setRenderPasswordErrorMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
    const [passwordRenderErrorMessage, setPasswordRenderErrorMessage] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

    // const [user, setUser] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
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

    const openAlertSuccess = (title, messsage) => {
        setShowAlertSuccess(true);
        setAlertTitle(title);
        setAlertMessage(messsage);
    };

    const hideAlert = () => {
		setShowAlert(false);
		setShowAlertSuccess(false);
    };

    const validateUserInput = (userValue) => {
        if (validator.isEmpty(userValue)) {
            showErrorMessageUser("No puede estar vacio")
            setValidUser(false);
        }
        else if (validator.contains(userValue, " ")) {
            showErrorMessageUser("No puede contener espacios")
            setValidUser(false);
        }
        else if (!validator.isLength(userValue, { min: 4, max: undefined })) {
            showErrorMessageUser("Debe tener más de 4 caracteres")
            setValidUser(false);
        }
        else {
            setValidUser(true);
            hideErrorMessageUser()
        }

        setUserValue(userValue);
    }

    const showErrorMessageUser = (message) => {
		setUserErrorMessage(message);
        setRenderUserErrorMessage(true);
    }

    const hideErrorMessageUser = () => {
		setUserErrorMessage("");
        setRenderUserErrorMessage(false);
    }

    const validateEmailInput = (emailValue) => {
        if (!validator.isEmail(emailValue)) {
            showErrorMessageEmail("El mail es incorrecto")
            setValidEmail(false);
        }
        else {
            setValidEmail(true);
            hideErrorMessageEmail()
        }

        setEmailValue(emailValue);
    }

    const showErrorMessageEmail = (message) => {
        setEmailErrorMessage(message);
        setRenderEmailErrorMessage(true);
    }

    const hideErrorMessageEmail = () => {
        setEmailErrorMessage("");
        setRenderEmailErrorMessage(false);
    }

    const validatePasswordInput = (passwordValue) => {
        if (passwordValue === "") {
            showErrorMessagePassword("No puede estar vacio")
            setValidPassword(false);
        }
        else if (validator.contains(passwordValue, " ")) {
            showErrorMessagePassword("No puede contener espacios")
            setValidPassword(false);
        }
        else if (!validator.isLength(passwordValue, { min: 6, max: 20 })) {
            showErrorMessagePassword("Debe tener entre 6 y 20 caracteres")
            setValidPassword(false);
        }
        else {
            setValidPassword(true);
            hideErrorMessagePassword()
        }

        setPasswordValue(passwordValue);
    }

    const showErrorMessagePassword = (message) => {
        setPasswordErrorMessage(message);
        setPasswordRenderErrorMessage(true);
    }

    const hideErrorMessagePassword = () => {
        setPasswordErrorMessage("");
        setRenderPasswordErrorMessage(false);
    }

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    const validateConfirmPasswordInput = (passwordConfirmValue) => {
        if (validator.isEmpty(passwordConfirmValue)) {
            showErrorMessageConfirmPassword("No puede estar vacio")
            setValidConfirmPassword(false)
        }
        else {
            setValidConfirmPassword(true);
            hideErrorMessageConfirmPassword()
        }

        setConfirmPasswordValue(passwordConfirmValue);
    }

    const showErrorMessageConfirmPassword = (message) => {
        setConfirmPasswordErrorMessage(message);
        setRenderConfirmPasswordErrorMessage(true);
    }

    const hideErrorMessageConfirmPassword = () => {
        setConfirmPasswordErrorMessage("");
        setRenderConfirmPasswordErrorMessage(false);
    }

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const formValid = () => {
        return !(validUser
            && validPassword
            && validEmail);
    }

    const userExist = async (username) => {
        let usuarioEncontrado = await getUserByUsernameRequest(username);

        return usuarioEncontrado.StatusCode == 200;
    };

    const emailExist = async (email) => {
        let usuarioEncontrado = await getUserByEmailRequest(email);

        console.log(JSON.stringify(usuarioEncontrado));

        return usuarioEncontrado.StatusCode == 200 ? true : false;
    };

    const encryptPassword = async (password) => {
        return await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            password
        );
    }

    const sendUser = async (newUser) => {
        let responseRegistro = await registerUserRequest(newUser);

        //Si se registro existosamente
        if (responseRegistro != null && responseRegistro.StatusCode == 200) {
            console.log(JSON.stringify(responseRegistro))
            setIsLoading(false);

            //Guarda el usuario en la store de redux
            // props.logInUser(responseRegistro.data);

            dispatch(logIn({
                    id: responseRegistro.data.id,
                    username: responseRegistro.data.username
                }
            ));

            console.log(newUser)
            openAlertSuccess("Felicitaciones", "Usuario registrado exitosamente")
        }
        else if (responseRegistro != null && responseRegistro.StatusCode == 502) {
            setIsLoading(false);
            setShowAlert(true);
            setAlertTitle("Error");
            setAlertMessage(responseRegistro.StatusText);
        }
    }

    const signUp = async () => {
        setIsLoading(true);

        if (await userExist(userValue)) {
            openAlert("Error", "El usuario ya esta registrado")
        }
        else if (await emailExist(emailValue)) {
            openAlert("Error", "El correo ya esta registrado")
        }
        else {
            let encryptedPassword = await encryptPassword(passwordValue)

            let newUser = {
                username: userValue,
                correoElectronico: emailValue,
                password: encryptedPassword
            }
            sendUser(newUser);
        }

        setIsLoading(false);
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

    const alertaExitosa = () => {
        return (
            <AwesomeAlert
                show={showAlertSuccess}
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
                    navigation.replace("HomeNavigation");
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
                        placeholder='Usuario'
                        label="Usuario"
                        leftIcon={
                            <Icon
                                name='user'
                                size={22}
                                color={ColorsApp.primaryColor}
                            />
                        }
                        errorStyle={ColorsApp.errorColor}
                        errorMessage={userErrorMessage}
                        renderErrorMessage={renderUserErrorMessage}
                        onChangeText={(userValue) => {
                            validateUserInput(userValue)
                        }}
                    />
                </View>

                <View style={styles.userInputContainer}>
                    <Input
                        style={styles.userInput}
                        placeholder='email@gmail.com'
                        label="Correo electrónico"
                        leftIcon={
                            <Icon
                                name='envelope'
                                size={20}
                                color={ColorsApp.primaryColor}
                            />
                        }
                        errorStyle={ColorsApp.errorColor}
                        errorMessage={emailErrorMessage}
                        renderErrorMessage={renderEmailErrorMessage}
                        onChangeText={(emailValue) => {
                            validateEmailInput(emailValue)
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
                                name="lock"
                                size={22}
                                color={ColorsApp.primaryColor}
                            />
                        }
                        rightIcon={
                            <Icon
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
                </View>


                <View style={styles.buttonsContainer}>
                    {/* Boton registrarse */}
                    <LargePrimaryButton 
                        title="Registrar"
                        actionFunction={() => {
                                signUp()
                            }}
                        disabled={formValid()}
                        />
                    
                    <Separator width={150} />

                    {/* Boton atras */}
                    <LargeSecondaryButton
                        title="Volver"
                        actionFunction={() => {
                            navigation.goBack()
                        }} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View>
                <Image
                    style={{
                        width: 240, height: 100, resizeMode: "center"
                    }}
                    source={
                        require("../assets/traxpetBlack.png")
                    }
                />
            </View>

            {isLoading ? <LoadingIndicator/> : loginScreen()}
            {alerta()}
            {alertaExitosa()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: ColorsApp.primaryBackgroundColor,
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
        color: ColorsApp.primaryBackgroundColor,
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
        backgroundColor: ColorsApp.primaryBackgroundColor,
        borderWidth: 2,
        borderColor: ColorsApp.primaryColor,
        borderRadius: 100
    },
    buttonBack: {
        width: 40,
        height: 40,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ColorsApp.primaryColor,
        borderWidth: 2,
        paddingRight: 3,
        borderColor: ColorsApp.primaryColor,
        borderRadius: 100
    },
    buttonRegistrarseText: {
        color: ColorsApp.primaryColor,
        fontSize: 16,
        fontWeight: "bold"
    }
});

export default SignUpScreen