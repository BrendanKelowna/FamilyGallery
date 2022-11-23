import React from "react"
import { usePage } from "../Context/PageProvider"
import ForgotPassword from "./ForgotPassword"
import Login from "./Login"
import Register from "./Register"
import Home from "./Home"
import Settings from "./Settings"
import { useUser } from "../Context/FirebaseProvider"
import NotAuth from "./NotAuth"
import ImagePicker from "./ImagePicker"
import DeletePicker from "./DeletePicker"

export default function PageHandler() {

  const user = useUser()
  const page = usePage()

  if (!user) {
    switch (page) {
      case "forgotpassword": return <ForgotPassword />
      case "register": return <Register />
      default: return < Login />
    }
  }
  else {
    if (!user.dbName) return <NotAuth />
    switch (page) {
      case "settings": return <Settings />
      case "upload": return <ImagePicker />
      case "delete": return <DeletePicker />
      default: return < Home />
    }
  }

}
