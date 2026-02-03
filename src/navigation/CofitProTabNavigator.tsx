import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CofitProTabParamList } from './types';

// Screens (只有主頁面，沒有詳情頁)
import ClientsScreen from '@/screens/cofitpro/ClientsScreen';
import ClientChatScreen from '@/screens/cofitpro/ClientChatScreen';
import CommunityScreen from '@/screens/cofitpro/CommunityScreen';
import NotificationsScreen from '@/screens/shared/NotificationsScreen';
import ProfileScreen from '@/screens/cofitpro/ProfileScreen';

const Tab = createBottomTabNavigator<CofitProTabParamList>();

export function CofitProTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Clients"
        component={ClientsScreen}
        options={{
          title: '我的客戶',
          tabBarLabel: '我的客戶',
          tabBarIcon: () => null, // TODO: 添加圖標
        }}
      />
      <Tab.Screen
        name="ClientChat"
        component={ClientChatScreen}
        options={{
          title: '客戶對話',
          tabBarLabel: '客戶對話',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: '社群',
          tabBarLabel: '社群',
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
