import React from "react"
import { View } from "react-native"
import { Text } from "react-native-elements"
import { styles } from "../../FamilyGallery"
import LogoutButton from "../Components/LogoutButton"

export type NotAuthProps = {

}

export default function NotAuth({ }: NotAuthProps) {
  return (
    <View style={styles.page}>
      <View style={{ ...styles.mb, width: 300 }}>
        <Text style={styles.subtext1}>You are not authorized yet. Ask for authorization. Then re-login</Text>
      </View>
      <LogoutButton />
    </View>
  )
}