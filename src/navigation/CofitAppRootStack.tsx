import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CofitAppRootStackParamList } from './types';

// Tab Navigator
import { CofitAppTabNavigator } from './CofitAppTabNavigator';

import {
  DiaryStack,
  ExpertStack,
  HomeStack,
  NotificationsStack,
  CofitAppProfileStack,
} from '@/navigation/stacks';

const Stack = createNativeStackNavigator<CofitAppRootStackParamList>();

export function CofitAppRootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={CofitAppTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiaryStack"
        component={DiaryStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExpertStack"
        component={ExpertStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsStack"
        component={NotificationsStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CofitAppProfileStack"
        component={CofitAppProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
