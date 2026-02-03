import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '@/screens/cofitapp/HomeScreen';

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: '首頁' }}
      />
    </Stack.Navigator>
  );
}
