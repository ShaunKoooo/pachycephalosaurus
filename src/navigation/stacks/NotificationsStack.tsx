import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import NotificationsScreen from '@/screens/shared/NotificationsScreen';

const Stack = createNativeStackNavigator();

export function NotificationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ title: '通知' }}
      />
    </Stack.Navigator>
  );
}
