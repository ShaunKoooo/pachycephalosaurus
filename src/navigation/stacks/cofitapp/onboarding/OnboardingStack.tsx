import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import { PAGE_CONFIG } from './pageConfig';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

/**
 * OnboardingStack
 * 首次登入使用者的引導流程
 * 包含基本資料、目標設定、活動習慣、斷食設定、餐盤設定等
 */
export function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 預設隱藏 header，讓各頁面自行控制
        gestureEnabled: false, // 禁用返回手勢，確保使用者按照流程完成
        animation: 'slide_from_right', // 統一使用右滑進入動畫
      }}
    >
      {PAGE_CONFIG.map((page) => (
        <Stack.Screen
          key={page.name}
          name={page.name}
          component={page.component}
          options={{
            title: page.title,
          }}
        />
      ))}
    </Stack.Navigator>
  );
}
