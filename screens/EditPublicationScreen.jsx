import React from 'react';
import { Text, View } from 'react-native';

const EditPublicationScreen = () => {
    const [nombreMascota, setNombreMascota] = useState(route.params.publicacion.mascota.nombre);
    const [formValid, setFormValid] = useState(true);
    const [publicacion, setPublicacion] = useState(route.params.publicacion);
    const [imagenes, setImagenes] = useState(route.params.imagenes);
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [buttonEnable, setButtonEnable] = useState(true);
    const [ubicacionData, setUbicacionData] = useState(route.params.ubicacion);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [publicationSuccessfull, setPublicationSuccessfull] = useState(false);
    const [firstImageSuccessfull, setFirstImageSuccessfull] = useState(false);
    const [secondImageSuccessfull, setSecondImageSuccessfull] = useState(false);
    const [thirdImageSuccessfull, setThirdImageSuccessfull] = useState(false);

    return (
        <View>
        <Text>EditPublicationScreen</Text>
        </View>
    )
}

export default EditPublicationScreen