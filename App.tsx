import React from 'react';
import { ThemeProvider } from 'styled-components'
import AppLoading from 'expo-app-loading';

import { AuthProvider } from './src/hooks/auth'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme'


import { Routes } from './src/routes'

import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';


export default function App() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });



  if (!fontsLoaded) {
    return (
      <AppLoading />
    )
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <ThemeProvider theme={theme}>
        <StatusBar translucent backgroundColor="transparent" />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider >
    </GestureHandlerRootView>
  );
}
