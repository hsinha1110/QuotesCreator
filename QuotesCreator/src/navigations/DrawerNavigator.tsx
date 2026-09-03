import React from 'react';

import {
  createDrawerNavigator,
  DrawerNavigationProp,
  useDrawerStatus,
} from '@react-navigation/drawer';

import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';

import BottomTabNavigator from './BottomTabNavigator';
import * as Screens from '@/screens/index';
import Routes from './Routes';
import { DrawerParamList } from './types';
import { CustomDrawerProps } from '@/types';
type CustomDrawerNavigationProps = CustomDrawerProps & {
  navigation: DrawerNavigationProp<DrawerParamList>;
};
const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerContent = (props: any) => {
  const drawerStatus = useDrawerStatus();

  return (
    <CustomDrawer
      visible={drawerStatus === 'open'}
      onClose={() => props.navigation.closeDrawer()}
    />
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={Routes.BOTTOM_TABS}
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
      {/* ========================================= */}
      {/* BOTTOM TABS */}
      {/* ========================================= */}

      <Drawer.Screen name={Routes.BOTTOM_TABS} component={BottomTabNavigator} />

      {/* ========================================= */}
      {/* DRAWER SCREENS */}
      {/* ========================================= */}
      <Drawer.Screen name={Routes.QUOTES} component={Screens.Quotes} />
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

      <Drawer.Screen
        name={Routes.SUB_CATEGORIES}
        component={Screens.SubCategories}
      />

      <Drawer.Screen
        name={Routes.NOTIFICATIONS}
        component={Screens.Notifications}
      />

      <Drawer.Screen
        name={Routes.NOTIFICATIONS_SETTINGS}
        component={Screens.NotificationsSettings}
      />

      <Drawer.Screen name={Routes.TIME_ZONE} component={Screens.TimeZone} />

      <Drawer.Screen
        name={Routes.QUOTES_DETAILS}
        component={Screens.QuotesDetails}
      />
      <Drawer.Screen name={Routes.LATEST} component={Screens.Latest} />
      <Drawer.Screen name={Routes.POPULAR} component={Screens.Popular} />
      <Drawer.Screen name={Routes.PROFILE} component={Screens.Profile} />
      <Drawer.Screen
        name={Routes.EDIT_PROFILE}
        component={Screens.EditProfile}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
