import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import Routes from './Routes';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.BOTTOM_TAB_NAVIGATOR}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.BOTTOM_TAB_NAVIGATOR}
        component={DrawerNavigator}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
