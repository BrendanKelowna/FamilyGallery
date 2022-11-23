import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, StyleSheet, StatusBar, Image } from "react-native"
import { } from 'react-native';
import { useSetMenu } from "../Context/MenuProvider";
import { useGallery } from "../Context/GalleryProvider";
import * as NavigationBar from "expo-navigation-bar";

export type ImageProps = {
  uri: string,
  width?: number,
  height?: number
}

export default function Home() {

  //Hide status bar
  useEffect(() => {
    StatusBar.setHidden(true);
    // NavigationBar.setPositionAsync("relative")
    // NavigationBar.setVisibilityAsync("hidden");
    // NavigationBar.setBehaviorAsync("inset-touch");
    return () => { StatusBar.setHidden(false) }
  }, [])

  const setMenu = useSetMenu()
  const assets = useGallery()
  const [photos, setphotos] = useState([] as ImageProps[])

  //remap photos
  useEffect(() => {
    const promises = [] as Promise<void>[]
    let photos = [] as ImageProps[]
    for (const key in assets) {
      assets[key].map((file) => {
        promises.push(
          Image.getSize(file.uri, (width, height) => {
            photos.push({ uri: file.uri, width, height })
          })
        )
      })
    }
    Promise.all(promises)
      .then(() => {
        const shuffledPhotos = shuffle(photos)
        console.log(shuffledPhotos)
        setphotos(shuffledPhotos)
      })
  }, [assets])

  const shuffle = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  //get random photo
  const getPhotoIndex = (current: number) => {
    let ret = current + 1
    if (ret === photos.length) ret = 0
    return ret

  }

  const [photoIndex, setphotoIndex] = useState(0)

  let timer = undefined as undefined | NodeJS.Timeout

  //loop
  useEffect(() => {
    timer = setTimeout(() => setphotoIndex(state => getPhotoIndex(state)), 10000);
    return () => { timer && clearTimeout(timer) }
  }, [photoIndex])

  return (
    <TouchableOpacity style={thisStyles.container} onPress={() => { setMenu && setMenu(true) }}>
      {(photos.length <= 0) && <Text style={thisStyles.text}> Welcome</Text>}
      {(photos.length > 0) && <Image style={thisStyles.image} source={photos[photoIndex]} />}
    </TouchableOpacity >
  )
}
const thisStyles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    flex: 1,
    // flexGrow: 1,
    // position: "absolute",
    //backgroundColor: "yellow",
    //alignContent: "space-around",
    justifyContent: "center",
    //alignSelf: "stretch",
    // height: 300,
    // width: 300
  },
  image: {
    flexGrow: 1,
    //flex: 1,
    //alignSelf: "stretch",
    // height: 300,
    width: "100%",
    //backgroundColor: "red",
    resizeMode: 'contain'
  },
  text: {
    alignSelf: "center",

  }

})