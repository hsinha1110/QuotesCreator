import React from 'react';

import {
  createDrawerNavigator,
  useDrawerStatus,
} from '@react-navigation/drawer';

import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';

import * as Screens from '@/screens/index';

const Drawer = createDrawerNavigator();

const DrawerContent = (props: any) => {
  const drawerStatus = useDrawerStatus();

  return (
    <CustomDrawer
      {...props}
      visible={drawerStatus === 'open'}
      onClose={() => {
        props.navigation.closeDrawer();
      }}
    />
  );
};

const HomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,

        // Drawer BottomTab/Home ke UPAR aayega
        drawerType: 'front',

        swipeEnabled: true,

        overlayColor: 'rgba(0,0,0,0.42)',

        drawerStyle: {
          width: '78%',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      {/* HOME */}
      <Drawer.Screen name="Home" component={Screens.Home} />

      {/* NOTIFICATIONS */}
      <Drawer.Screen name="Notifications" component={Screens.Notifications} />

      {/* MY CREATIONS */}
      <Drawer.Screen name="CreateQuotes" component={Screens.CreateQuotes} />

      {/* FAVORITES */}
      <Drawer.Screen name="Favorites" component={Screens.Favorites} />

      {/* TEMPLATES */}
      <Drawer.Screen name="Templates" component={Screens.Templates} />

      {/* DOWNLOADS */}
      <Drawer.Screen name="Downloads" component={Screens.Downloads} />

      {/* SETTINGS */}
      <Drawer.Screen name="Settings" component={Screens.Settings} />

      {/* ABOUT */}
      <Drawer.Screen name="About" component={Screens.About} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigator;
