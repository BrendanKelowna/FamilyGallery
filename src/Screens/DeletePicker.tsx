import React, { useMemo, useState } from "react"
import { StyleProp, ViewStyle, TextStyle, StyleSheet, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { mainColor, mainColorL1, rootFolder } from "../../FamilyGallery";
import { AssetsSelector } from "../Forked libs/expo-images-picker/index";
import { ErrorsType, NavigatorType, SettingsType, StylesType } from "expo-images-picker/src/Types";
import { useSetPage } from "../Context/PageProvider";
import { Asset, MediaType } from 'expo-media-library'
import { ref, deleteObject } from "@firebase/storage"
import { useStorage } from "../Context/FirebaseProvider";
import { useUser } from "../Context/FirebaseProvider";
import { deleteAsync, readDirectoryAsync } from "expo-file-system"
import { join } from "path"
import { folderPath } from "../Context/GalleryProvider";

// global
// SYNC db with cache
// get storage lists
// get cache lists
// compare delete or download to cache
// start slidshow
// 
// change rules read other family folders

export type DeletePickerProps = {
}


export default function DeletePicker({ }: DeletePickerProps) {


  const [error, seterror] = useState([] as string[])
  const [done, setdone] = useState([] as string[])

  const setPage = useSetPage()
  const storage = useStorage()
  const user = useUser()

  const onBack = () => {
    setPage && setPage("settings")
  }

  const onFinish = (assets: Asset[]) => {
    assets.map((asset) => {
      const _ref = ref(storage!, join(rootFolder, user!.dbName!, asset.filename))
      //deleteAssetsAsync
      deleteObject(_ref)
        .then(() => deleteAsync(asset.uri))
        .then(() => setdone((state) => [...state, asset.id]))
        .catch((error) => {
          seterror((state) => [...state, asset.id])
        })
    })
  }

  const getImages = () => {
    const location = folderPath(user!.dbName) + "/"

    return readDirectoryAsync(location)
      .then((folder) => folder.map((fileName) => {
        return {
          id: fileName,
          filename: fileName,
          uri: location + fileName,
          mediaType: "photo",
        } as Asset
      }))

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
      assetsType: [MediaType.photo, MediaType.video],
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
        finish: 'Delete',
        back: 'Back',
        selected: 'Selected (Max 25)',
      },
      midTextColor: 'black',
      minSelection: 1,
      buttonTextStyle: _textStyle,
      buttonStyle: _buttonStyle,
      onBack,
      onSuccess: onFinish,
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
        DoneItems={done}
        ErrorItems={error}
        CustomGetAssets={getImages}
      />
    </View>

  )
}
const thisStyles = StyleSheet.create({
  container: {
    flex: 1,
  }
})