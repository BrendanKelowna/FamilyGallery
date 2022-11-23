import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../FamilyGallery";
import { useSetPage } from "../Context/PageProvider";

export default function LoginLink() {

  const setPage = useSetPage()

  return (
    <TouchableOpacity onPress={() => setPage && setPage("login")}>
      <View>
        <Text style={styles.link}>Login</Text>
      </View>
    </TouchableOpacity>
  )
}