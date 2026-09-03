import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationsTabs } from '@/constants/Data';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { notificationHistoryByIdThunk } from '@/redux/thunk/notificationHistoryByIdThunk';
import { readNotificationsThunk } from '@/redux/thunk/readNotificationsThunk';
import { deleteNotificationThunk } from '@/redux/thunk/deleteNotificationThunk';
import { NotificationItem } from '@/types';
import ItemNotifications from '@/components/ListItems/ItemNotifications/ItemNotifications';
import Routes from '@/navigations/Routes';
import { goBack, navigate } from '@/utils/NavigationUtils';
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/redux/slices/notificationsSlice';
import EmptyState from '@/components/EmptyState/EmptyState';
import styles from './styles';
import moment from 'moment';
import Header from '@/components/Header/Header';
import Tabs from '@/components/Tabs/Tabs';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) {
      console.log('USER ID NOT FOUND');
      return;
    }

    const getNotifications = async () => {
      try {
        const response = await dispatch(
          notificationHistoryByIdThunk(userId),
        ).unwrap();
        if (response?.success) {
          setNotifications(response.notifications || []);
        } else {
          setNotifications([]);
        }
      } catch (error: any) {
        console.log('NOTIFICATIONS HISTORY ERROR:', error);
        setNotifications([]);
      }
    };

    getNotifications();
  }, [userId, dispatch]);

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleNotificationPress = async (id: string) => {
    try {
      const notification = notifications.find(item => item._id === id);

      if (notification && !notification.isRead) {
        await dispatch(readNotificationsThunk(id)).unwrap();

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
        dispatch(markNotificationAsRead(id));
      }

      navigate(Routes.BOTTOM_TABS, {
        screen: Routes.HOME,
      });
    } catch (error) {
      console.log('Notification press error:', error);
    }
  };
  const handleMarkAllAsRead = async () => {
    try {
      // Sirf unread notifications nikalo
      const unreadNotifications = notifications.filter(
        notification => !notification.isRead,
      );

      if (unreadNotifications.length === 0) {
        return;
      }

      // 🔥 Har unread notification ko read API call karo
      await Promise.all(
        unreadNotifications.map(notification =>
          dispatch(readNotificationsThunk(notification._id)).unwrap(),
        ),
      );

      // Local Notifications screen update
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
        })),
      );

      // 🔥 Redux update → Home badge remove
      dispatch(markAllNotificationsAsRead());

      console.log('✅ ALL NOTIFICATIONS MARKED AS READ');
    } catch (error) {
      console.log('❌ MARK ALL AS READ ERROR:', error);
    }
  };
  const handleDeleteNotification = async (id: string) => {
    try {
      setNotifications(prev =>
        prev.filter(notification => notification._id !== id),
      );

      const response = await dispatch(deleteNotificationThunk(id)).unwrap();

      console.log('DELETE RESPONSE:', response);
    } catch (error) {
      console.log('DELETE ERROR:', error);

      if (userId) {
        try {
          const response = await dispatch(
            notificationHistoryByIdThunk(userId),
          ).unwrap();

          if (response?.success) {
            setNotifications(response.notifications || []);
          }
        } catch (refreshError) {
          console.log('REFRESH ERROR:', refreshError);
        }
      }
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'Unread') {
      return notifications.filter(item => !item.isRead);
    }

    return notifications;
  }, [activeTab, notifications]);

  const unreadCount = notifications.filter(item => !item.isRead).length;
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <Header
        title="Notifications"
        icon="chevron-back"
        onMenuPress={goBack}
        showNotification={false}
        rightIcon="trash-outline"
        onRightPress={() => {}}
      />

      <Tabs
        tabs={NotificationsTabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {unreadCount > 0 && (
        <View style={styles.markAllContainer}>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>

          <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => {
          const currentDate = moment(item.createdAt).startOf('day');
          const previousItem = filteredNotifications[index - 1];
          const showDate =
            index === 0 ||
            !previousItem ||
            !currentDate.isSame(
              moment(previousItem.createdAt).startOf('day'),
              'day',
            );

          const today = moment().startOf('day');
          const yesterday = moment().subtract(1, 'day').startOf('day');
          let dateLabel = '';

          if (currentDate.isSame(today, 'day')) {
            dateLabel = `Today, ${currentDate.format('DD MMM YYYY')}`;
          } else if (currentDate.isSame(yesterday, 'day')) {
            dateLabel = `Yesterday, ${currentDate.format('DD MMM YYYY')}`;
          } else {
            dateLabel = 'Earlier';
          }

          return (
            <View>
              {showDate && (
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{dateLabel}</Text>
                </View>
              )}

              <ItemNotifications
                item={item}
                onPress={handleNotificationPress}
                onDelete={handleDeleteNotification}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="notifications-outline"
              title="No Notifications"
              description="You're all caught up!"
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Notifications;
