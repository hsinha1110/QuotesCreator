import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';

import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

import App from './App';
import { name as appName } from './app.json';

const messaging = getMessaging();

// ======================================
// BACKGROUND / KILLED FCM HANDLER
// ======================================

setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('🔥 BACKGROUND FCM:', remoteMessage);

  // IMPORTANT:
  // Backend notification payload bhej raha hai,
  // isliye yahan Notifee se notification
  // display MAT karo.
  //
  // Android FCM notification payload ko
  // background/killed state me automatically
  // show karega.
});

AppRegistry.registerComponent(appName, () => App);
