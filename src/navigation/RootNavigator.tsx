import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Config from 'react-native-config';
import { CofitAppRootStack } from './CofitAppRootStack';
import { CofitProRootStack } from './CofitProRootStack';

export function RootNavigator() {
  // 根據環境變數或 scheme 選擇不同的 Root Stack
  const appType = Config.APP_TYPE || 'cofitapp';

  const getNavigator = () => {
    switch (appType) {
      case 'cofitpro':
        return <CofitProRootStack />;
      case 'cofitapp':
      case 'cofitstaging':
      default:
        return <CofitAppRootStack />;
    }
  };

  return <NavigationContainer>{getNavigator()}</NavigationContainer>;
}
