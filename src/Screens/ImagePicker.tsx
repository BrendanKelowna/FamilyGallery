import React, { useEffect, useMemo, useState } from "react"
import { StyleProp, ViewStyle, TextStyle, StyleSheet, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { MediaType } from 'expo-media-library';
import { mainColor, mainColorL1, rootFolder } from "../../FamilyGallery";
///import { AssetsSelector } from "expo-images-picker"
import { AssetsSelector } from "../Forked libs/expo-images-picker/index";
import { ErrorsType, NavigatorType, SettingsType, StylesType } from "expo-images-picker/src/Types";
import { useSetPage } from "../Context/PageProvider";
import { Asset } from 'expo-media-library'
import Toast from "react-native-toast-message";
import { useStorage, useUser } from "../Context/FirebaseProvider";
import { ref, uploadBytes } from "@firebase/storage"
import { join } from "path"
import { copyAsync } from "expo-file-system"
import { folderPath } from "../Context/GalleryProvider";

export type ImagePickerProps = {

}

export type Loading = {
  done: number
  error: number
  total: number
}

export default function ImagePicker({ }: ImagePickerProps) {

  const setPage = useSetPage()
  const storage = useStorage()
  const user = useUser()
  const [loading, setloading] = useState([] as string[])
  const [error, seterror] = useState([] as string[])
  const [done, setdone] = useState([] as string[])
  const controllerlist = [] as AbortController[]

  useEffect(() => {
    return () => {
      controllerlist.forEach(controller => {
        controller.abort()
      });
    }
  }, [])

  const onBack = () => { setPage && setPage("settings") }


  const onSuccess = (data?: Asset[]) => {

    if (!data || data === []) Toast.show({
      type: 'info',
      text1: 'No images selected'
    })
    else {
      upload(data)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: "Success",
          })
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: "Error",
          })
        })
    }
  }

  const upload = (data: Asset[]) => {

    return new Promise((resolve, reject) => {

      if (!storage) return reject({ message: "No firebase storage object" })
      if (!user || !user.dbName) return reject({ message: "No dbname on User object" })

      setloading(data.map((image) => { return image.id }))

      const promises = data.map((image) => {

        const _ref = ref(storage!, join(rootFolder, user!.dbName!, image.filename))

        const controller = new AbortController();
        const signal = controller.signal;
        controllerlist.push(controller)
        const uri = folderPath(user.dbName) + "/" + image.filename

        fetch(image.uri, { signal })
          .then((response) => response.blob())
          .then((rawData) => uploadBytes(_ref, rawData))
          .then(() => copyAsync({ from: image.uri, to: uri }))
          .then(() => {
            setdone((state) => {
              state.push(image.id)
              return [...state]
            })
          })
          .catch((error) => {
            seterror((state) => {
              state.push(image.id)
              return [...state]
            })
          })
          .finally(() => {
            setloading((state) => {
              state.splice(state.indexOf(image.id), 1)
              return [...state]
            })
          })
      })

      resolve(Promise.all(promises)
        .finally(() => controllerlist.splice(0, controllerlist.length))
      )
    })
  }

  const imagePickerErrors = useMemo(
    () => ({
      errorTextColor: 'black',
      errorMessages: {
        hasErrorWithPermissions: 'Please Allow media gallery permissions.',
        hasErrorWithLoading: 'There was an error while loading images.',
        hasErrorWithResizing: 'There was an error while loading images.',
        hasNoAssets: 'No images found.',
      },
    } as ErrorsType),
    []
  );

  const imagePickerSettings = useMemo(
    () => ({
      getImageMetaData: false, // true might perform slower results but gives meta data and absolute path for ios users
      initialLoad: 100,
      assetsType: [MediaType.photo],
      minSelection: 1,
      maxSelection: 25,
      portraitCols: 4,
      landscapeCols: 4,
    } as SettingsType),
    []
  );

  const _textStyle = {
    color: 'white',
    fontWeight: "bold",
  } as StyleProp<TextStyle>;

  const _buttonStyle = {
    backgroundColor: mainColor,
    borderRadius: 5,
  } as StyleProp<ViewStyle>;

  const imagePickerNavigator = useMemo(
    () => ({
      Texts: {
        finish: 'Save',
        back: 'Back',
        selected: 'Selected (Max 25)',
      },
      midTextColor: 'black',
      minSelection: 1,
      buttonTextStyle: _textStyle,
      buttonStyle: _buttonStyle,
      onBack,
      onSuccess,
    } as NavigatorType),
    []
  );

  const imagePickerStyles = useMemo(
    () => ({
      margin: 2,
      bgColor: 'white',
      spinnerColor: mainColor,
      widgetWidth: 99,
      videoIcon: {
        Component: Ionicons,
        iconName: 'ios-videocam',
        color: 'tomato',
        size: 20,
      },
      selectedIcon: {
        Component: Ionicons,
        iconName: 'ios-checkmark-circle-outline',
        color: 'white',
        bg: mainColorL1,
        size: 26,
      },
    } as StylesType),
    []
  );

  return (
    <View style={thisStyles.container}>
      <AssetsSelector
        Settings={imagePickerSettings}
        Errors={imagePickerErrors}
        Styles={imagePickerStyles}
        Navigator={imagePickerNavigator}
        LoadingItems={loading}
        DoneItems={done}
        ErrorItems={error}
      />
    </View>

  )
}

const thisStyles = StyleSheet.create({
  container: {
    flex: 1,
  }
})