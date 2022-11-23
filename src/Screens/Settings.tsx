import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { styles } from "../../FamilyGallery";
import { StatusBar } from 'react-native';
import { Button, Chip } from "react-native-elements";
import MyCombo from "../Components/MyCombo";
import SetDatabase from "../Components/SetDatabase";
import Toast from "react-native-toast-message";
import { httpsCallable } from "@firebase/functions"
import { useFunctions, useUser } from "../Context/FirebaseProvider";
import { useSetPage } from "../Context/PageProvider";
import LogoutButton from "../Components/LogoutButton";
import { useSetGallery } from "../Context/GalleryProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {

  StatusBar.setHidden(false);

  const f = useFunctions()
  const setAdmin = f ? httpsCallable(f, "setAdmin") : undefined
  const setDatabase = f ? httpsCallable(f, "setDatabase") : undefined
  const setPage = useSetPage()
  const user = useUser()
  const setGallery = useSetGallery()


  const handleOpenImageSelector = () => { setPage && setPage("upload") }
  const handleOpenDeleteImageSelector = () => { setPage && setPage("delete") }

  const handleAdmin = (email?: string) => {
    if (!email) Toast.show({
      type: 'error',
      text1: 'Enter an email'
    })
    else {
      setAdmin && setAdmin({ email })
        .then(() => {
          Toast.show({
            type: 'success',
            text1: email + ' is now Admin!'
          })
          user && user.getIdToken && user.getIdToken(true)
        })
        .catch((error) => {
          Toast.show({
            type: 'error',
            text1: 'failed',
            text2: error.message
          })
        })
    }
  }

  const handleSetDatabase = (email?: string, dbName?: string) => {
    if (!email) Toast.show({
      type: 'error',
      text1: 'Enter an email'
    })
    else if (!dbName) Toast.show({
      type: 'error',
      text1: 'Select a Database'
    })
    else {
      setDatabase && setDatabase({ email, dbName })
        .then(() => {
          Toast.show({
            type: 'success',
            text1: "Success",
            text2: email + ' now belongs to ' + dbName
          })
          user && user.getIdToken && user.getIdToken(true)
        })
        .catch((error) => {
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: error.message
          })
        })
    }
  }


  const thisStyles = StyleSheet.create({
    page: {
      flexGrow: 1,
      backgroundColor: "white",
      flexDirection: "column",
      alignItems: "center",
      flexWrap: "wrap",
      alignSelf: "center"
    },
    container: {
      //flex: 1,
      //flexShrink: 1,
      //flexGrow: 0,
      //flexBasis: 600,
      maxHeight: 350,
      marginHorizontal: 20,
      marginTop: 20
    },
    item: {
      justifyContent: "center",
    }
  })


  return (
    <View style={{ ...thisStyles.page }}>
      <View style={{ ...thisStyles.container }}>
        <View style={{ ...styles.horizontal, marginBottom: 15 }}>
          <View style={{ alignSelf: "center" }}>
            <Chip
              title="Back"
              style={{}}
              buttonStyle={{ ...styles.clip, marginRight: 30 }}
              onPress={() => { setPage && setPage("home") }}
              icon={{ name: "chevron-left", size: 20, color: 'white', type: "material" }}
            />
          </View>
          <Text style={{ ...styles.pageTitle }}>Settings</Text>
        </View>
        {(user && user.admin) && <MyCombo onPress={handleAdmin} placeholder="Email..." buttonProps={{ title: "Set Admin" }} />}
        {(user && user.admin) && <SetDatabase onPress={handleSetDatabase} />}
      </View>
      <View style={{ ...thisStyles.container }} >
        <Button
          title="Sync"
          buttonStyle={{ ...styles.buttonStyle, ...styles.mb, ...styles.width }}
          onPress={() => { setGallery && setGallery() }}
          icon={{ name: "sync", size: 20, color: 'white', }}
        />
        <Button
          title="Upload Photos"
          buttonStyle={{ ...styles.buttonStyle, ...styles.mb, ...styles.width }}
          onPress={() => handleOpenImageSelector()}
          icon={{ name: "collections", size: 20, color: 'white', }}
        />
        <Button
          title="Delete Photos"
          buttonStyle={{ ...styles.buttonStyle, ...styles.mb, ...styles.width }}
          onPress={() => handleOpenDeleteImageSelector()}
          icon={{ name: "delete", size: 20, color: 'white', }}
        />
        <View style={{ ...styles.mb, ...styles.width }}><LogoutButton /></View>
      </View>
    </View >
  )
}