import { getAuth, sendPasswordResetEmail } from "@firebase/auth"
import React, { useState } from "react"
import { TextInput } from "react-native"
import Toast from "react-native-toast-message"
import { styles } from "../../FamilyGallery"
import LoginLink from "../Components/LoginLink"
import RegisterLink from "../Components/RegisterLink"
import AuthWidget from "./AuthWidget"

export default function ForgotPassword() {

  const [email, setemail] = useState("")

  const auth = getAuth()

  const handleClick = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Successfully sent reset password email'
        })
      })
      .catch((e) => {
        Toast.show({
          type: 'error',
          text1: e.message
        })
      })
  }

  const buttons = <>
    <LoginLink />
    <RegisterLink />
  </>

  return (

    <AuthWidget title="Forgot Password" onClick={handleClick} buttons={buttons}>
      <TextInput
        style={{ ...styles.inputs, ...styles.mb }}
        autoCompleteType="email"
        placeholder="Email"
        onChangeText={(newValue) => { setemail(newValue) }}
      />
    </AuthWidget>
  )
}