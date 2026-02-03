/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import '@/locales'; // 初始化 i18n
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
