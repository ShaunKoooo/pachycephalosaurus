import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import Config from 'react-native-config';
import { CofitAppRootStack } from './CofitAppRootStack';
import { CofitProRootStack } from './CofitProRootStack';
import LoginPage from '@/screens/auth/LoginPage';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { checkAuthStatus } from '@/store/slices/authSlice';

export function RootNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const appType = Config.APP_TYPE || 'cofitapp';

  // 檢查登入狀態
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Loading 畫面
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // 未登入顯示 LoginPage
  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <LoginPage />
      </NavigationContainer>
    );
  }

  // 已登入，根據 app type 顯示對應的 Navigator
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
