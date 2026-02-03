import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpertScreen from '@/screens/cofitapp/ExpertScreen';

type ExpertStackParamList = {
  ExpertScreen: undefined;
};

const Stack = createNativeStackNavigator<ExpertStackParamList>();

export function ExpertStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpertScreen"
        component={ExpertScreen}
        options={{ title: '專家' }}
      />
    </Stack.Navigator>
  );
}
