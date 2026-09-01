import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F4',
    backgroundColor: '#FFFFFF',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F4EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 20,
    color: '#7437E8',
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingVertical: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 12,
    color: '#8A8A91',
    lineHeight: 17,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  value: {
    fontSize: 12,
    color: '#77777F',
    marginRight: 6,
  },

  arrow: {
    fontSize: 25,
    color: '#8C8C93',
    fontWeight: '300',
  },
});
