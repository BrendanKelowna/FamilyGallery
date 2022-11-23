import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "../../FamilyGallery";
import { useSetPage } from "../Context/PageProvider";

export default function ForgotPasswordLink() {

  const setPage = useSetPage()

  return (
    <TouchableOpacity onPress={() => setPage && setPage("forgotpassword")}>
      <View>
        <Text style={styles.link}>Forgot Password</Text>
      </View>
    </TouchableOpacity>
  )
}