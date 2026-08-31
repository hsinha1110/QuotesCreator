import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { HeaderProps } from '@/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '@/constants/Colors';
import styles from './styles';
import Entypo from 'react-native-vector-icons/Entypo';

const Header = ({
  title,
  // LEFT
  icon = 'menu-outline',
  onMenuPress,
  showMenu = true,

  // RIGHT
  rightIcon,
  onRightPress,

  // NOTIFICATION
  onNotificationPress,
  showNotification = true,
  notificationCount = 0,
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View style={styles.side}>
        {showMenu ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onMenuPress}
            style={styles.iconButton}
          >
            <Ionicons
              name={icon}
              size={moderateScale(25)}
              color={COLORS.black}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* CENTER */}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* RIGHT */}
      <View style={[styles.side, styles.rightSide]}>
        {rightIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightPress}
            style={styles.iconButton}
          >
            <Ionicons
              name={rightIcon}
              size={moderateScale(23)}
              color={COLORS.black}
            />
          </TouchableOpacity>
        ) : showNotification ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNotificationPress}
            style={styles.iconButton}
          >
            <Ionicons
              name="notifications-outline"
              size={moderateScale(23)}
              color={COLORS.black}
            />

            {notificationCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
