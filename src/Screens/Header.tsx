import React, { useRef, useState } from "react"
import { StyleSheet, View, Text, Touchable, TouchableOpacity, BackHandler, Animated } from "react-native"
import { useMenu, useSetMenu } from "../Context/MenuProvider"
import { Chip, Icon } from 'react-native-elements'
import { useSetPage } from "../Context/PageProvider"
import { mainColor, styles } from "../../FamilyGallery"

export type HeaderProps = {

}

export default function Header(props: HeaderProps) {
  const open = useMenu()
  const setOpen = useSetMenu()
  const setPage = useSetPage()

  const animHeight = useRef(new Animated.Value(0)).current  // Initial value

  React.useEffect(() => {
    open ? Animated.timing(
      animHeight,
      {
        toValue: 75,
        duration: 200,
        useNativeDriver: false
      }
    ).start()
      : Animated.timing(
        animHeight,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }
      ).start()

  }, [open])

  const thisStyles = StyleSheet.create({
    container: {
      display: "flex",
      // justifyContent: "space-between",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 2,
      // flex: 1,
      alignSelf: 'stretch',
      // height: 700,
      // width: 300
    },
    overlay: {
      backgroundColor: "black",
      // alignSelf: 'stretch',
      flex: 1,
      opacity: 0.2,
    },
    section: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      backgroundColor: "black",
      alignSelf: 'stretch',
      height: 75,
      opacity: 0.9,
      // width: 50
    },
    text: {
      color: "white",
    }
  })

  const handleClose = () => { setOpen && setOpen(false) }
  const handlePressSettings = () => {
    handleClose()
    setPage && setPage("settings")
  }
  const handlePressClose = () => {
    handleClose()
    BackHandler.exitApp()
  }

  return (<>
    {open && <View style={thisStyles.container}>
      <TouchableOpacity onPress={handleClose}>
        <Animated.View style={{ ...thisStyles.section, height: animHeight }}>
          <Chip
            title="Settings"
            buttonStyle={styles.clip}
            onPress={handlePressSettings}
            icon={{ name: "settings", size: 20, color: 'white', }}
          />

          <Chip
            title="Close"
            buttonStyle={styles.clip}
            onPress={handlePressClose}
            icon={{ name: "close", size: 20, color: 'white', }}
          />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity style={thisStyles.overlay} onPress={() => { setOpen && setOpen(false) }}>
        <View></View>
      </TouchableOpacity>
    </View>}

  </>
  )
}