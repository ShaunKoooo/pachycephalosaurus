import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientChatScreen from '@/screens/cofitpro/ClientChatScreen';

const Stack = createNativeStackNavigator();

export function ClientChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientChatScreen"
        component={ClientChatScreen}
        options={{ title: '客戶對話' }}
      />
    </Stack.Navigator>
  );
}
