import { useState } from "react";
import { React } from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import { ColorsApp } from "./Colors";

const Alert = (props) => {
  const [showAlert, setShowAlert] = useState(true);
  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={props.alertTitle}
      message={props.alertMessage}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText="Ok"
      confirmButtonColor={ColorsApp.primaryColor}
      onConfirmPressed={() => {
        props.onConfirmFunction()
        setShowAlert(false)
      }}
    />
  );
};

export default Alert;
