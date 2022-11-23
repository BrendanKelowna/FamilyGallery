import { signOut } from "firebase/auth"
import React from "react"
import { Button } from "react-native-elements"
import { styles } from "../../FamilyGallery"
import { useAuth } from "../Context/FirebaseProvider"

export type LogoutButtonProps = {

}

export default function LogoutButton({ }: LogoutButtonProps) {

  const auth = useAuth()

  const handleLogout = () => {
    auth && signOut(auth)
  }

  return (
    <Button
      title="Logout"
      buttonStyle={{ ...styles.buttonStyle }}
      onPress={handleLogout}
      icon={{ name: "logout", size: 20, color: 'white', }}
    />
  )
}