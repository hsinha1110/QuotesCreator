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

        // ==========================================
        // ANDROID 13+ NOTIFICATION PERMISSION
        // ==========================================

        if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
          console.log('🤖 REQUESTING ANDROID NOTIFICATION PERMISSION');

          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          console.log('🔔 Android Notification Permission:', result);

          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('❌ Android notification permission denied');

            // FCM token ke liye yahan return nahi kar rahe.
            // Token generation continue ho sakta hai.
          } else {
            console.log('✅ Android notification permission granted');
          }
        }

        // ==========================================
        // iOS NOTIFICATION PERMISSION
        // ==========================================

        if (Platform.OS === 'ios') {
          console.log('🍎 REQUESTING iOS NOTIFICATION PERMISSION');

          const { status } = await requestNotifications([
            'alert',
            'badge',
            'sound',
          ]);

          console.log('🍎 iOS Notification Permission:', status);

          if (status !== RESULTS.GRANTED && status !== RESULTS.LIMITED) {
            console.log('❌ iOS notification permission denied');
          }
        }

        // ==========================================
        // REGISTER DEVICE FOR REMOTE MESSAGES
        // ==========================================

        console.log('🔥 REGISTERING DEVICE FOR REMOTE MESSAGES');

        await registerDeviceForRemoteMessages(messaging);

        console.log('✅ REMOTE MESSAGES REGISTERED');

        // ==========================================
        // ANDROID NOTIFICATION CHANNEL
        // ==========================================

        if (Platform.OS === 'android') {
          const channelId = await notifee.createChannel({
            id: 'quotes',

            name: 'Quotes Notifications',

            importance: AndroidImportance.HIGH,

            vibration: true,

            sound: 'default',
          });

          console.log('🔔 Notification Channel:', channelId);
        }

        // ==========================================
        // GET FCM TOKEN
        // ==========================================

        console.log('================================');

        console.log('🔥 STEP 1: ABOUT TO GET FCM TOKEN');

        console.log('================================');

        try {
          const token = await getToken(messaging);

          console.log('🔥 STEP 2: GET TOKEN COMPLETED');

          console.log('================================');

          console.log('🔥🔥🔥 FCM TOKEN 🔥🔥🔥');

          console.log('TOKEN:', token);

          console.log('================================');

          if (!token) {
            console.log('❌ FCM TOKEN EMPTY');
          } else {
            console.log('✅ FCM TOKEN RECEIVED SUCCESSFULLY');

            // ======================================
            // BACKEND TOKEN REGISTRATION
            // ======================================

            // Yahan baad me backend API call karna:
            //
            // await registerDeviceToken(token);
          }
        } catch (error: any) {
          console.log('❌ GET FCM TOKEN ERROR:', error);

          console.log('❌ FCM ERROR CODE:', error?.code);

          console.log('❌ FCM ERROR MESSAGE:', error?.message);
        }

        // ==========================================
        // TOKEN REFRESH
        // ==========================================

        unsubscribeTokenRefresh = onTokenRefresh(messaging, async newToken => {
          console.log('================================');

          console.log('🔥 FCM TOKEN REFRESHED');

          console.log('NEW TOKEN:', newToken);

          console.log('================================');

          // Backend ko updated token bhejna:
          //
          // await registerDeviceToken(newToken);
        });

        // ==========================================
        // FOREGROUND MESSAGE
        // ==========================================

        unsubscribeMessage = onMessage(messaging, async remoteMessage => {
          console.log('================================');

          console.log('🔥 FOREGROUND FCM MESSAGE');

          console.log('MESSAGE:', remoteMessage);

          console.log('================================');

          const title = String(
            remoteMessage.notification?.title ??
              remoteMessage.data?.title ??
              'Quotes',
          );

          const body = String(
            remoteMessage.notification?.body ?? remoteMessage.data?.body ?? '',
          );

          // ======================================
          // ANDROID
          // ======================================

          if (Platform.OS === 'android') {
            await notifee.displayNotification({
              title,

              body,

              android: {
                channelId: 'quotes',

                importance: AndroidImportance.HIGH,

                pressAction: {
                  id: 'default',
                },
              },
            });
          }

          // ======================================
          // iOS
          // ======================================

          if (Platform.OS === 'ios') {
            await notifee.displayNotification({
              title,

              body,

              ios: {
                sound: 'default',
              },
            });
          }
        });

        console.log('================================');

        console.log('✅ FCM SETUP COMPLETED');

        console.log('================================');
      } catch (error: any) {
        console.log('❌ FCM SETUP ERROR:', error);

        console.log('❌ FCM ERROR CODE:', error?.code);

        console.log('❌ FCM ERROR MESSAGE:', error?.message);
      }
    };

    setupNotifications();

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      unsubscribeMessage?.();

      unsubscribeTokenRefresh?.();
    };
  }, []);

  return <RoutesNavigators />;
};

export default App;
