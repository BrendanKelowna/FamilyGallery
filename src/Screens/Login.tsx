import React, { useState } from "react";
import { TextInput } from "react-native";
import { styles } from "../../FamilyGallery";
import AuthWidget from "./AuthWidget";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import Toast from "react-native-toast-message";
import RegisterLink from "../Components/RegisterLink";
import ForgotPasswordLink from "../Components/ForgotPasswordLink";



export default function Login() {

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const auth = getAuth()

  const handleClick = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then()
      .catch((e) => {
        Toast.show({
          type: 'error',
          text1: e.message
        })
      })
  }

  const other = <>

  </>

  const buttons = <>
    <RegisterLink />
    <ForgotPasswordLink />
  </>

  return (
    <AuthWidget title="Login" onClick={handleClick} buttons={buttons} other={other}>
      <TextInput
        style={{ ...styles.inputs, ...styles.mb }}
        autoCompleteType="email"
        placeholder="Email"
        onChangeText={(newValue) => { setemail(newValue) }}
      />
      <TextInput
        style={{ ...styles.inputs, ...styles.mb }}
        secureTextEntry={true}
        passwordRules="required: upper; required: lower; max-consecutive: 2; minlength: 8;"
        autoCompleteType="password"
        placeholder="Password"
        onChangeText={(newValue) => { setpassword(newValue) }} />
    </AuthWidget>
  )
}