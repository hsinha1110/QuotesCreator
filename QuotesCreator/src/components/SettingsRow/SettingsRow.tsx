import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { useSelector } from 'react-redux';

import { THEME_COLORS, ThemeColors } from '@/constants/Colors';
import { RootState } from '@/redux/store';

interface SettingsRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: (event: GestureResponderEvent) => void;
  showArrow?: boolean;
}

const SettingsRow = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showArrow = true,
}: SettingsRowProps) => {
  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // ==========================================
  // UI
  // ==========================================

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={onPress}
    >
      {/* Icon */}

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Content */}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {/* Right Side */}

      <View style={styles.rightContainer}>
        {value ? <Text style={styles.value}>{value}</Text> : null}

        {showArrow && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default SettingsRow;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      minHeight: 76,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },

    iconContainer: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: colors.light_grey,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    icon: {
      fontSize: 20,
      color: colors.accent,
      fontWeight: '600',
    },

    content: {
      flex: 1,
      paddingVertical: 8,
    },

    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },

    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
    },

    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },

    value: {
      fontSize: 12,
      color: colors.textSecondary,
      marginRight: 6,
    },

    arrow: {
      fontSize: 25,
      color: colors.iconSecondary,
      fontWeight: '300',
    },
  });
