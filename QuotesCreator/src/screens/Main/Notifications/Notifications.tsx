import React, {useEffect, useMemo, useState} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from '@/redux/store';

import {
  notificationHistoryByIdThunk,
} from '@/redux/thunk/notificationHistoryByIdThunk';

import {
  readNotificationsThunk,
} from '@/redux/thunk/readNotificationsThunk';

import {
  deleteNotificationThunk,
} from '@/redux/thunk/deleteNotificationThunk';

import {NotificationItem} from '@/types';

import ItemNotifications from '@/components/ListItems/ItemNotifications/ItemNotifications';

import EmptyState from '@/components/EmptyState/EmptyState';

import Header from '@/components/Header/Header';

import Tabs from '@/components/Tabs/Tabs';

import Routes from '@/navigations/Routes';

import {
  goBack,
  navigate,
} from '@/utils/NavigationUtils';

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/redux/slices/notificationsSlice';

import createStyles from './styles';

import moment from 'moment';

import {translations} from '@/language';

import {THEME_COLORS} from '@/constants/Colors';

const Notifications = () => {
  const [activeTab, setActiveTab] =
    useState('All');

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const dispatch =
    useDispatch<AppDispatch>();

  // =========================
  // THEME
  // =========================

  const themeMode = useSelector(
    (state: RootState) =>
      state.theme.mode,
  );

  const colors =
    THEME_COLORS[themeMode];

  const styles =
    createStyles(colors);

  // =========================
  // LANGUAGE
  // =========================

  const language = useSelector(
    (state: RootState) =>
      state.language.language,
  );

  const t =
    translations[language]
      .NOTIFICATIONS;

  // =========================
  // USER
  // =========================

  const userId = useSelector(
    (state: RootState) =>
      state.auth.user?.id,
  );

  // =========================
  // NOTIFICATION TABS
  // =========================

  const notificationTabs =
    useMemo(
      () => [
        {
          key: 'All',
          title: t.ALL,
        },
        {
          key: 'Unread',
          title: t.UNREAD_TAB,
        },
      ],
      [t],
    );

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  useEffect(() => {
    if (!userId) {
      console.log(
        'USER ID NOT FOUND',
      );

      return;
    }

    const getNotifications =
      async () => {
        try {
          const response =
            await dispatch(
              notificationHistoryByIdThunk(
                userId,
              ),
            ).unwrap();

          if (response?.success) {
            setNotifications(
              response.notifications ||
                [],
            );
          } else {
            setNotifications([]);
          }
        } catch (error: any) {
          console.log(
            'NOTIFICATIONS HISTORY ERROR:',
            error,
          );

          setNotifications([]);
        }
      };

    getNotifications();
  }, [userId, dispatch]);

  // =========================
  // TAB PRESS
  // =========================

  const handleTabPress = (
    tabKey: string,
  ) => {
    setActiveTab(tabKey);
  };

  // =========================
  // NOTIFICATION PRESS
  // =========================

  const handleNotificationPress =
    async (id: string) => {
      try {
        const notification =
          notifications.find(
            item => item._id === id,
          );

        if (
          notification &&
          !notification.isRead
        ) {
          await dispatch(
            readNotificationsThunk(id),
          ).unwrap();

          setNotifications(prev =>
            prev.map(item =>
              item._id === id
                ? {
                    ...item,
                    isRead: true,
                  }
                : item,
            ),
          );

          dispatch(
            markNotificationAsRead(id),
          );
        }

        navigate(
          Routes.BOTTOM_TABS,
          {
            screen: Routes.HOME,
          },
        );
      } catch (error) {
        console.log(
          'Notification press error:',
          error,
        );
      }
    };

  // =========================
  // MARK ALL AS READ
  // =========================

  const handleMarkAllAsRead =
    async () => {
      try {
        const unreadNotifications =
          notifications.filter(
            notification =>
              !notification.isRead,
          );

        if (
          unreadNotifications.length ===
          0
        ) {
          return;
        }

        await Promise.all(
          unreadNotifications.map(
            notification =>
              dispatch(
                readNotificationsThunk(
                  notification._id,
                ),
              ).unwrap(),
          ),
        );

        setNotifications(prev =>
          prev.map(notification => ({
            ...notification,
            isRead: true,
          })),
        );

        dispatch(
          markAllNotificationsAsRead(),
        );

        console.log(
          '✅ ALL NOTIFICATIONS MARKED AS READ',
        );
      } catch (error) {
        console.log(
          '❌ MARK ALL AS READ ERROR:',
          error,
        );
      }
    };

  // =========================
  // DELETE NOTIFICATION
  // =========================

  const handleDeleteNotification =
    async (id: string) => {
      try {
        setNotifications(prev =>
          prev.filter(
            notification =>
              notification._id !== id,
          ),
        );

        const response =
          await dispatch(
            deleteNotificationThunk(id),
          ).unwrap();

        console.log(
          'DELETE RESPONSE:',
          response,
        );
      } catch (error) {
        console.log(
          'DELETE ERROR:',
          error,
        );

        if (userId) {
          try {
            const response =
              await dispatch(
                notificationHistoryByIdThunk(
                  userId,
                ),
              ).unwrap();

            if (response?.success) {
              setNotifications(
                response.notifications ||
                  [],
              );
            }
          } catch (
            refreshError
          ) {
            console.log(
              'REFRESH ERROR:',
              refreshError,
            );
          }
        }
      }
    };

  // =========================
  // FILTER
  // =========================

  const filteredNotifications =
    useMemo(() => {
      if (
        activeTab === 'Unread'
      ) {
        return notifications.filter(
          item => !item.isRead,
        );
      }

      return notifications;
    }, [
      activeTab,
      notifications,
    ]);

  // =========================
  // UNREAD COUNT
  // =========================

  const unreadCount =
    notifications.filter(
      item => !item.isRead,
    ).length;

  // =========================
  // UI
  // =========================

  return (
    <SafeAreaView
      style={styles.container}>
      
      {/* HEADER */}

      <Header
        title={t.TITLE}
        icon="chevron-back"
        onMenuPress={goBack}
        showNotification={false}
        onRightPress={() => {}}
      />

      {/* TABS */}

      <Tabs
        tabs={notificationTabs}
        activeTab={activeTab}
        onTabPress={
          handleTabPress
        }
      />

      {/* UNREAD */}

      {unreadCount > 0 && (
        <View
          style={
            styles.markAllContainer
          }>
          
          <Text
            style={styles.unreadText}>
            {unreadCount} {t.UNREAD}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={
              handleMarkAllAsRead
            }>
            <Text
              style={
                styles.markAllText
              }>
              {t.MARK_ALL_READ}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* NOTIFICATIONS LIST */}

      <FlatList
        data={
          filteredNotifications
        }
        keyExtractor={item =>
          item._id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContainer
        }
        renderItem={({
          item,
          index,
        }) => {
          const currentDate =
            moment(
              item.createdAt,
            ).startOf('day');

          const previousItem =
            filteredNotifications[
              index - 1
            ];

          const showDate =
            index === 0 ||
            !previousItem ||
            !currentDate.isSame(
              moment(
                previousItem.createdAt,
              ).startOf('day'),
              'day',
            );

          const today =
            moment().startOf('day');

          const yesterday =
            moment()
              .subtract(1, 'day')
              .startOf('day');

          let dateLabel = '';

          if (
            currentDate.isSame(
              today,
              'day',
            )
          ) {
            dateLabel = `${
              t.TODAY
            }, ${currentDate.format(
              'DD MMM YYYY',
            )}`;
          } else if (
            currentDate.isSame(
              yesterday,
              'day',
            )
          ) {
            dateLabel = `${
              t.YESTERDAY
            }, ${currentDate.format(
              'DD MMM YYYY',
            )}`;
          } else {
            dateLabel = t.EARLIER;
          }

          return (
            <View>
              {showDate && (
                <View
                  style={
                    styles.dateContainer
                  }>
                  <Text
                    style={
                      styles.dateText
                    }>
                    {dateLabel}
                  </Text>
                </View>
              )}

              <ItemNotifications
                item={item}
                onPress={
                  handleNotificationPress
                }
                onDelete={
                  handleDeleteNotification
                }
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }>
            <EmptyState
              icon="notifications-outline"
              title={
                t.EMPTY_TITLE
              }
              description={
                t.EMPTY_DESCRIPTION
              }
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Notifications;