import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CofitProRootStackParamList } from './types';

// Tab Navigator
import { CofitProTabNavigator } from './CofitProTabNavigator';

import {
  ClientsStack,
  NotificationsStack,
  ClientChatStack,
  CommunityStack,
  CofitProProfileStack,
} from '@/navigation/stacks';

const Stack = createNativeStackNavigator<CofitProRootStackParamList>();

export function CofitProRootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={CofitProTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientsStack"
        component={ClientsStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientChatStack"
        component={ClientChatStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsStack"
        component={NotificationsStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CofitProProfileStack"
        component={CofitProProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
