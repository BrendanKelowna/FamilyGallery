import React from 'react';
import Toast from 'react-native-toast-message';
import { PageProvider } from './src/Context/PageProvider';
import PageHandler from './src/Screens/PageHandler';
import { StyleSheet } from 'react-native';
import Header from './src/Screens/Header';
import { MenuProvider } from './src/Context/MenuProvider';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FirebaseProvider } from './src/Context/FirebaseProvider';
import { GalleryProvider } from './src/Context/GalleryProvider';

const thisStyles = StyleSheet.create({
  body: {
    flex: 1,
  }
})

export default function App() {

  return (
    <FirebaseProvider>
      <PageProvider>
        <MenuProvider>
          <GalleryProvider>
            <SafeAreaProvider>
              <SafeAreaView style={thisStyles.body}>
                <Header />
                <PageHandler />
                <Toast
                  position='bottom'
                  bottomOffset={20}
                />
              </SafeAreaView>
            </SafeAreaProvider>
          </GalleryProvider>
        </MenuProvider>
      </PageProvider>
    </FirebaseProvider>
  );
}


