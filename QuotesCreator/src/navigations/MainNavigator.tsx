import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { mergedStacks } from './ScreenCollections';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {mergedStacks.map(item => (
        <Stack.Screen
          key={item.name}
          name={item.name}
          component={item.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default MainNavigator;
