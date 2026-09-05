import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

import {HeaderProps} from '@/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RootState} from '@/redux/store';
import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

const Header = ({
  title,

  // LEFT
  icon = 'menu-outline',
  onMenuPress,
  showMenu = true,

  // RIGHT
  rightIcon,
  rightText,
  onRightPress,

  // NOTIFICATION
  onNotificationPress,
  showNotification = true,
  notificationCount = 0,
}: HeaderProps) => {
  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* =================================================
          LEFT
      ================================================= */}

      <View style={styles.side}>
        {showMenu ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onMenuPress}
            style={styles.iconButton}>
            <Ionicons
              name={icon}
              size={moderateScale(25)}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* =================================================
          CENTER
      ================================================= */}

      <View style={styles.center}>
        <Text
          style={styles.title}
          numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* =================================================
          RIGHT
      ================================================= */}

      <View style={[styles.side, styles.rightSide]}>
        {rightIcon || rightText ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightPress}
            style={styles.rightButton}>
            
            {/* RIGHT TEXT */}

            {rightText ? (
              <Text
                style={styles.rightText}
                numberOfLines={1}>
                {rightText}
              </Text>
            ) : null}

            {/* RIGHT ICON */}

            {rightIcon ? (
              <Ionicons
                name={rightIcon}
                size={moderateScale(23)}
                color={colors.textPrimary}
              />
            ) : null}
          </TouchableOpacity>
        ) : showNotification ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNotificationPress}
            style={styles.iconButton}>
            
            {/* NOTIFICATION ICON */}

            <Ionicons
              name="notifications-outline"
              size={moderateScale(23)}
              color={colors.textPrimary}
            />

            {/* NOTIFICATION BADGE */}

            {notificationCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99
                    ? '99+'
                    : notificationCount}
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