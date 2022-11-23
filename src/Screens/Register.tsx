import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail } from "@firebase/auth"
import React, { useState } from "react"
import { TextInput } from "react-native"
import Toast from "react-native-toast-message"
import { styles } from "../../FamilyGallery"
import ForgotPasswordLink from "../Components/ForgotPasswordLink"
import LoginLink from "../Components/LoginLink"
import AuthWidget from "./AuthWidget"

export default function Register() {

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const auth = getAuth()

  const handleClick = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Successfully created user'
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
    <ForgotPasswordLink />
  </>

  return (

    <AuthWidget title="Register" onClick={handleClick} buttons={buttons}>
      <TextInput
        style={{ ...styles.inputs, ...styles.mb }}
        autoCompleteType="email"
        placeholder="Email"
        onChangeText={(newValue) => { setemail(newValue) }}
      />
      <TextInput
        style={{ ...styles.inputs, ...styles.mb }}
        secureTextEntry={true}
        autoCompleteType="password"
        placeholder="Password"
        onChangeText={(newValue) => { setpassword(newValue) }}
      />
    </AuthWidget>
  )
}