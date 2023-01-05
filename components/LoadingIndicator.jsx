import { View, ActivityIndicator } from 'react-native'
import React from 'react'

import { ColorsApp } from '../constants/Colors'

const LoadingIndicator = () => {
    return (
        <View>
            <ActivityIndicator size={60} color={ColorsApp.primaryColor} />
        </View>
    )
}

export default LoadingIndicator