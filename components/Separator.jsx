import { View, Text } from 'react-native'
import React from 'react'
import { Divider } from "@rneui/themed";

const Separator = (props) => {
    return (
        <Divider
            orientation="horizontal"
            color="#AAA"
            width={1}
            style={{ width: props.width, marginVertical: 15 }}
        />
    )
}

export default Separator