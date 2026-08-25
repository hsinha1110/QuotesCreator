import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import Routes from './Routes';
import * as Screens from '@/screens/index';
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.SPLASH}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.SPLASH} component={Screens.Splash} />
      <Stack.Screen name={Routes.ONBOARDING} component={Screens.OnBoarding} />
      <Stack.Screen name={Routes.LOGIN} component={Screens.Login} />
      <Stack.Screen name={Routes.REGISTER} component={Screens.Register} />
      <Stack.Screen name={Routes.FORGOT} component={Screens.Forgot} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
