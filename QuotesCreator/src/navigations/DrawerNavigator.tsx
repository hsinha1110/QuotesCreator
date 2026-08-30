import React from 'react';

import {
  createDrawerNavigator,
  useDrawerStatus,
} from '@react-navigation/drawer';

import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';

import BottomTabNavigator from './BottomTabNavigator';
import * as Screens from '@/screens';
import Routes from './Routes';

const Drawer = createDrawerNavigator();

const DrawerContent = (props: any) => {
  const drawerStatus = useDrawerStatus();

  return (
    <CustomDrawer
      {...props}
      visible={drawerStatus === 'open'}
      onClose={() => props.navigation.closeDrawer()}
    />
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="BottomTabs"
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: true,
        overlayColor: 'rgba(0,0,0,0.42)',
        drawerStyle: {
          width: '78%',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      {/* MAIN APP */}
      <Drawer.Screen name="BottomTabs" component={BottomTabNavigator} />

      {/* DRAWER SCREENS */}

      <Drawer.Screen
        name={Routes.NOTIFICATIONS}
        component={Screens.Notifications}
      />

      <Drawer.Screen
        name={Routes.CREATE_QUOTES}
        component={Screens.CreateQuotes}
      />

      <Drawer.Screen name={Routes.FAVORITES} component={Screens.Favorites} />

      <Drawer.Screen name={Routes.TEMPLATES} component={Screens.Templates} />

      <Drawer.Screen name={Routes.DOWNLOADS} component={Screens.Downloads} />

      <Drawer.Screen name={Routes.SETTINGS} component={Screens.Settings} />

      <Drawer.Screen name={Routes.ABOUT} component={Screens.About} />

      <Drawer.Screen name={Routes.CATEGORIES} component={Screens.Categories} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
