import { useState } from "react";
import { React } from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import { ColorsApp } from "../constants/Colors";

const Alert = (showAlert, alertTitle, alertMessage, confirmText, onConfirmFunction) => {
  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={alertTitle}
      message={alertMessage}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText={confirmText}
      confirmButtonColor={ColorsApp.primaryColor}
      onConfirmPressed={() => {
        onConfirmFunction()
      }}
    />
  );
};

export default Alert;
