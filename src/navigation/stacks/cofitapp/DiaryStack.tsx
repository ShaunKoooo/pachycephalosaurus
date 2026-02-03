import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiaryStackParamList } from '../../types';

import DiaryScreen from '@/screens/cofitapp/DiaryScreen';

const Stack = createNativeStackNavigator<DiaryStackParamList>();

export function DiaryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiaryScreen"
        component={DiaryScreen}
        options={{ title: '日記' }}
      />
    </Stack.Navigator>
  );
}
