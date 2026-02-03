import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientsScreen from '@/screens/cofitpro/ClientsScreen';

const Stack = createNativeStackNavigator();

export function ClientsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientsScreen"
        component={ClientsScreen}
        options={{ title: '我的客戶' }}
      />
    </Stack.Navigator>
  );
}
