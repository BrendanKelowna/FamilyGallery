import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../FamilyGallery";
import { useSetPage } from "../Context/PageProvider";

export default function RegisterLink() {

  const setPage = useSetPage()

  return (
    <TouchableOpacity
      onPress={() => {
        setPage && setPage("register")
      }}
    >
      <View>
        <Text style={styles.link}>Register</Text>
      </View>
    </TouchableOpacity>
  )
}