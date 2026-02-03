import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '@/screens/cofitpro/ProfileScreen';

const Stack = createNativeStackNavigator();

export function CofitProProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: '我的' }}
      />
    </Stack.Navigator>
  );
}
