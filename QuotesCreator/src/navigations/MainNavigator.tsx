import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Routes from './Routes';
import * as Screens from '@/screens/index';
import { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.BOTTOM_TABS}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.BOTTOM_TABS}
        component={Screens.DrawerNavigator}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
