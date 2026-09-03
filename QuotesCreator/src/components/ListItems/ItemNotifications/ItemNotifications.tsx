import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale } from 'react-native-size-matters';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import moment from 'moment';

import COLORS from '@/constants/Colors';
import styles from './styles';

export interface NotificationItem {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}

interface ItemNotificationsProps {
  item: NotificationItem;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

const ItemNotifications = ({
  item,
  onPress,
  onDelete,
}: ItemNotificationsProps) => {
  const swipeableRef = useRef<any>(null);

  const handleCardPress = () => {
    // Close swipe action before navigation
    swipeableRef.current?.close();

    // Send notification ID to parent
    onPress(item._id);
  };

  const handleDelete = () => {
    // Close swipe action
    swipeableRef.current?.close();

    // Delete notification
    onDelete(item._id);
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.deleteAction}
        onPress={handleDelete}
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

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootRight={false}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      <Pressable
        style={[
          styles.notificationCard,
          !item.isRead && styles.unreadNotificationCard,
        ]}
        onPress={handleCardPress}
      >
        {/* UNREAD DOT */}
        <View style={styles.dotContainer}>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        {/* BELL ICON */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="notifications"
            size={moderateScale(18)}
            color={COLORS.accent}
          />
        </View>

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadTitle,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <Text style={styles.timeText}>
              {moment(item.createdAt).format('h:mm A')}
            </Text>
          </View>

          <Text
            style={[styles.messageText, !item.isRead && styles.unreadMessage]}
            numberOfLines={2}
          >
            {item.body}
          </Text>
        </View>

        {/* ARROW */}
        <Ionicons
          name="chevron-forward"
          size={moderateScale(18)}
          color={COLORS.black}
        />
      </Pressable>
    </Swipeable>
  );
};

export default ItemNotifications;
