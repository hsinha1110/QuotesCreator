import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '@/utils/NavigationUtils';
import MainNavigator from '@/navigations/MainNavigator';

const RoutesNavigators = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default RoutesNavigators;
