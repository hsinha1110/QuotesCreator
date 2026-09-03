import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import {
  getMessaging,
  getToken,
  onMessage,
  registerDeviceForRemoteMessages,
  onTokenRefresh,
} from '@react-native-firebase/messaging';

import notifee, { AndroidImportance } from '@notifee/react-native';
import { requestNotifications, RESULTS } from 'react-native-permissions';
import Config from 'react-native-config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// NAVIGATION IMPORTS
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '@/utils/NavigationUtils';
import RoutesNavigators from '@/navigations/RoutesNavigators';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

const App = () => {
  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeTokenRefresh: (() => void) | undefined;

    // ==========================================
    // FCM SETUP
    // ==========================================
    const setupNotifications = async () => {
      try {
        console.log('================================');
        console.log('🔥 FCM SETUP STARTED');
        console.log('================================');

        const messaging = getMessaging();

        // ANDROID 13+ PERMISSION
        if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('❌ Android notification permission denied');
          } else {
            console.log('✅ Android notification permission granted');
          }
        }

        // iOS PERMISSION
        if (Platform.OS === 'ios') {
          const { status } = await requestNotifications([
            'alert',
            'badge',
            'sound',
          ]);

          if (status !== RESULTS.GRANTED && status !== RESULTS.LIMITED) {
            console.log('❌ iOS notification permission denied');
          }
        }

        // REGISTER DEVICE
        await registerDeviceForRemoteMessages(messaging);

        // ANDROID NOTIFICATION CHANNEL
        if (Platform.OS === 'android') {
          await notifee.createChannel({
            id: 'quotes',
            name: 'Quotes Notifications',
            importance: AndroidImportance.HIGH,
            vibration: true,
            sound: 'default',
          });
        }

        // GET FCM TOKEN
        try {
          const token = await getToken(messaging);
          if (token) {
            console.log('✅ FCM TOKEN RECEIVED SUCCESSFULLY:', token);
          }
        } catch (error: any) {
          console.log('❌ GET FCM TOKEN ERROR:', error);
        }

        // TOKEN REFRESH
        unsubscribeTokenRefresh = onTokenRefresh(messaging, async newToken => {
          console.log('🔥 FCM TOKEN REFRESHED:', newToken);
        });

        // FOREGROUND MESSAGE
        unsubscribeMessage = onMessage(messaging, async remoteMessage => {
          const title = String(
            remoteMessage.notification?.title ??
              remoteMessage.data?.title ??
              'Quotes',
          );

          const body = String(
            remoteMessage.notification?.body ?? remoteMessage.data?.body ?? '',
          );

          if (Platform.OS === 'android') {
            await notifee.displayNotification({
              title,
              body,
              android: {
                channelId: 'quotes',
                importance: AndroidImportance.HIGH,
                pressAction: { id: 'default' },
              },
            });
          }

          if (Platform.OS === 'ios') {
            await notifee.displayNotification({
              title,
              body,
              ios: { sound: 'default' },
            });
          }
        });
      } catch (error: any) {
        console.log('❌ FCM SETUP ERROR:', error);
      }
    };

    setupNotifications();

    return () => {
      unsubscribeMessage?.();
      unsubscribeTokenRefresh?.();
    };
  }, []);

  return (
    // 🔥 NAVIGATION REF ATTACHED HERE
    <RoutesNavigators />
  );
};

export default App;
