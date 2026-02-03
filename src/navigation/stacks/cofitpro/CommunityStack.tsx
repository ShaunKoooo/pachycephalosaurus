import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommunityScreen from '@/screens/cofitpro/CommunityScreen';

const Stack = createNativeStackNavigator();

export function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CommunityScreen"
        component={CommunityScreen}
        options={{ title: '社群' }}
      />
    </Stack.Navigator>
  );
}
