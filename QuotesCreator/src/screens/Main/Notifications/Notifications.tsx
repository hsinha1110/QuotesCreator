import React, { useEffect, useMemo, useState } from 'react';

import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { DrawerActions, useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { moderateScale } from 'react-native-size-matters';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import moment from 'moment';

import Header from '@/components/Header/Header';
import Tabs from '@/components/Tabs/Tabs';
import EmptyState from '@/components/EmptyState/EmptyState';

import { NotificationsTabs } from '@/constants/Data';
import COLORS from '@/constants/Colors';

import styles from './styles';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';

import { notificationHistoryByIdThunk } from '@/redux/thunk/notificationHistoryByIdThunk';

import { readNotificationsThunk } from '@/redux/thunk/readNotificationsThunk';
import { deleteNotificationThunk } from '@/redux/thunk/deleteNotificationThunk';
import { NotificationItem } from '@/types';
import ItemNotifications from '@/components/ListItems/ItemNotifications/ItemNotifications';

const Notifications = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [activeTab, setActiveTab] = useState('All');

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    if (!userId) {
      console.log('USER ID NOT FOUND');
      return;
    }

    const getNotifications = async () => {
      try {
        console.log('🔔 FETCH NOTIFICATIONS:', userId);

        const response = await dispatch(
          notificationHistoryByIdThunk(userId),
        ).unwrap();

        console.log('🔔 NOTIFICATIONS RESPONSE:', response);

        if (response?.success) {
          setNotifications(response.notifications || []);
        } else {
          setNotifications([]);
        }
      } catch (error: any) {
        console.log('❌ NOTIFICATIONS HISTORY ERROR:', error);

        setNotifications([]);
      }
    };

    getNotifications();
  }, [userId, dispatch]);

  // =====================================================
  // TAB
  // =====================================================

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  // =====================================================
  // MARK SINGLE AS READ
  // =====================================================

  const handleNotificationPress = async (id: string) => {
    try {
      // Optimistic UI update
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      await dispatch(readNotificationsThunk(id)).unwrap();

      console.log('✅ NOTIFICATION MARKED AS READ:', id);
    } catch (error) {
      console.log('❌ MARK READ ERROR:', error);
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        isRead: true,
      })),
    );

    console.log('✅ ALL NOTIFICATIONS MARKED AS READ');
  };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const handleDeleteNotification = async (id: string) => {
    try {
      console.log('🗑️ DELETE NOTIFICATION:', id);

      // Remove immediately from UI
      setNotifications(prev =>
        prev.filter(notification => notification._id !== id),
      );

      const response = await dispatch(deleteNotificationThunk(id)).unwrap();

      console.log('✅ DELETE RESPONSE:', response);
    } catch (error) {
      console.log('❌ DELETE ERROR:', error);

      // If API fails, fetch again
      if (userId) {
        try {
          const response = await dispatch(
            notificationHistoryByIdThunk(userId),
          ).unwrap();

          if (response?.success) {
            setNotifications(response.notifications || []);
          }
        } catch (refreshError) {
          console.log('❌ REFRESH ERROR:', refreshError);
        }
      }
    }
  };

  // =====================================================
  // RIGHT SWIPE ACTION
  // =====================================================

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.deleteAction}
        onPress={() => handleDeleteNotification(id)}
      >
        <Ionicons
          name="trash-outline"
          size={moderateScale(22)}
          color={COLORS.white}
        />

        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'Unread') {
      return notifications.filter(item => !item.isRead);
    }

    return notifications;
  }, [activeTab, notifications]);

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount = notifications.filter(item => !item.isRead).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Header
        title="Notifications"
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        rightIcon="options-outline"
        onRightPress={() => {}}
        showNotification={false}
      />

      {/* ================================================= */}
      {/* TABS */}
      {/* ================================================= */}

      <Tabs
        tabs={NotificationsTabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* ================================================= */}
      {/* MARK ALL */}
      {/* ================================================= */}

      {unreadCount > 0 && (
        <View style={styles.markAllContainer}>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>

          <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

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
              {/* DATE HEADER */}

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
