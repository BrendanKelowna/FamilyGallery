import React, { useState } from "react"
import { StyleSheet, TextInput, View } from "react-native"
import { Button, ButtonProps, Input, InputProps } from "react-native-elements"
import { minWidth, styles } from "../../FamilyGallery"

export type MyComboProps = Omit<InputProps, "onChangeText" | "onPress"> & {
  buttonProps?: ButtonProps
  onPress: (newValue: string) => void
}

export default function MyCombo({ onPress, buttonProps, ...props }: MyComboProps) {

  const [input, setinput] = useState("")

  const thisStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,

    },
    input: {
      flexGrow: 1,
      minWidth: 200,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    },
    button: {
      width: 100,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
  })

  return (
    <View style={thisStyles.container}>
      <TextInput
        onChangeText={(value) => setinput(value)}

        style={{ ...styles.inputs, ...thisStyles.input }}
        {...props}
      />
      <Button
        style={{ ...styles.button }}
        buttonStyle={{ ...styles.buttonStyle, ...thisStyles.button }}
        onPress={() => { onPress(input) }}
        {...buttonProps}
      />
    </View>
  )
}