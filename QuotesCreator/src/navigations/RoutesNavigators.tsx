import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { navigationRef } from '@/utils/NavigationUtils';

import { store, persistor, RootState } from '@/redux/store';

import MainNavigator from '@/navigations/MainNavigator';
import AuthNavigator from '@/navigations/AuthNavigator';

import { AuthProvider, useAuth } from '@/context/AuthContext';

const AppNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const { loading } = useAuth();

  console.log('==========================');
  console.log('AUTH TOKEN =>', token);
  console.log('TOKEN EXISTS =>', !!token);
  console.log('AUTH LOADING =>', loading);
  console.log('==========================');

  if (loading) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {token ? <MainNavigator key="main" /> : <AuthNavigator key="auth" />}
    </NavigationContainer>
  );
};

const AppLoading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6C2BD9" />
    </View>
  );
};

const RoutesNavigators = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <PersistGate loading={<AppLoading />} persistor={persistor}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RoutesNavigators;
