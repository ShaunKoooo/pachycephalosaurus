import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CofitAppTabParamList } from './types';

// Screens (只有主頁面，沒有詳情頁)
import HomeScreen from '@/screens/cofitapp/HomeScreen';
import DiaryScreen from '@/screens/cofitapp/DiaryScreen';
import ExpertScreen from '@/screens/cofitapp/ExpertScreen';
import ShopScreen from '@/screens/cofitapp/ShopScreen';
import NotificationsScreen from '@/screens/shared/NotificationsScreen';
import ProfileScreen from '@/screens/cofitapp/ProfileScreen';

const Tab = createBottomTabNavigator<CofitAppTabParamList>();

export function CofitAppTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首頁',
          tabBarLabel: '首頁',
          tabBarIcon: () => null, // TODO: 添加圖標
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          title: '日記',
          tabBarLabel: '日記',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Expert"
        component={ExpertScreen}
        options={{
          title: '專家',
          tabBarLabel: '專家',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          title: '購物',
          tabBarLabel: '購物',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: '通知',
          tabBarLabel: '通知',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarLabel: '我的',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
