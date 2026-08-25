import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import {
  getMessaging,
  getToken,
  onMessage,
  requestPermission,
} from '@react-native-firebase/messaging';

import notifee, {
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';

import RoutesNavigators from '@/navigations/RoutesNavigators';

const App = () => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeNotifications = async () => {
      try {
        const messaging = getMessaging();

        // ======================================
        // ANDROID 13+ NOTIFICATION PERMISSION
        // ======================================

        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          console.log('🔔 Android notification permission:', permission);
        }

        // ======================================
        // FCM PERMISSION
        // ======================================

        const authStatus = await requestPermission(messaging);

        console.log('🔥 FCM permission status:', authStatus);

        // ======================================
        // ANDROID NOTIFICATION CHANNEL
        // ======================================

        if (Platform.OS === 'android') {
          const channelId = await notifee.createChannel({
            id: 'quotes',
            name: 'Quotes Notifications',
            importance: AndroidImportance.HIGH,
            sound: 'default',
          });

          console.log('🔔 Notification channel:', channelId);
        }

        // ======================================
        // GET FCM TOKEN
        // ======================================

        const token = await getToken(messaging);

        console.log('🔥 FCM TOKEN:', token);

        // ======================================
        // FOREGROUND MESSAGE LISTENER
        // ======================================

        unsubscribe = onMessage(messaging, async remoteMessage => {
          try {
            console.log('🔥 FOREGROUND FCM:', remoteMessage);

            // ======================================
            // TITLE
            // ======================================

            const title = String(
              remoteMessage.notification?.title ??
                remoteMessage.data?.title ??
                'Quotes',
            );

            // ======================================
            // BODY
            // ======================================

            const body = String(
              remoteMessage.notification?.body ??
                remoteMessage.data?.body ??
                '',
            );

            // ======================================
            // IMAGE
            // ======================================

            const image = String(
              remoteMessage.notification?.android?.imageUrl ??
                remoteMessage.data?.image ??
                '',
            );

            console.log('🔔 Notification title:', title);

            console.log('🔔 Notification body:', body);

            console.log('🔔 Notification image:', image);

            // ======================================
            // DISPLAY LOCAL NOTIFICATION
            // ======================================

            await notifee.displayNotification({
              title,
              body,

              data: Object.fromEntries(
                Object.entries(remoteMessage.data ?? {}).map(([key, value]) => [
                  key,
                  String(value),
                ]),
              ),

              android: {
                channelId: 'quotes',
                importance: AndroidImportance.HIGH,
                sound: 'default',

                pressAction: {
                  id: 'default',
                },

                // ONLY BIG IMAGE
                ...(image
                  ? {
                      style: {
                        type: AndroidStyle.BIGPICTURE,
                        picture: image,
                      },
                    }
                  : {}),
              },
            });

            console.log('✅ Notification displayed successfully');
          } catch (error) {
            console.log('❌ Foreground notification error:', error);
          }
        });
      } catch (error) {
        console.log('❌ Notification initialization error:', error);
      }
    };

    initializeNotifications();

    // ======================================
    // CLEANUP
    // ======================================

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return <RoutesNavigators />;
};

export default App;
