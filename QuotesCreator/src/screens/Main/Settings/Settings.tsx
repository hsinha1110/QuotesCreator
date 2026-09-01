import Routes from '@/navigations/Routes';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsProps {
  navigation?: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: (event: GestureResponderEvent) => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
}

const Settings = ({ navigation }: SettingsProps) => {
  const SettingRow = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    showArrow = true,
    rightComponent,
  }: SettingRowProps) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.row}
        onPress={onPress}
        disabled={!onPress}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{title}</Text>

          {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
        </View>

        {/* Right Side */}
        {rightComponent ? (
          rightComponent
        ) : (
          <View style={styles.rightContainer}>
            {value ? <Text style={styles.value}>{value}</Text> : null}

            {showArrow ? <Text style={styles.arrow}>›</Text> : null}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Preferences */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>

        <View style={styles.card}>
          <SettingRow
            icon="◎"
            title="Language"
            subtitle="Choose your preferred language"
            value="English"
            onPress={() => navigation?.navigate('Language')}
          />

          <SettingRow
            icon="◉"
            title="Theme"
            subtitle="Customize app appearance"
            value="Light"
            onPress={() => navigation?.navigate('Theme')}
          />

          <SettingRow
            icon="Aa"
            title="Font Size"
            subtitle="Adjust text size"
            value="Medium"
            onPress={() => navigation?.navigate('FontSize')}
          />

          <SettingRow
            icon="◷"
            title="Notification Time"
            subtitle="Daily quote notification time"
            value="08:00 AM"
            onPress={() => navigation?.navigate('NotificationTime')}
          />

          <SettingRow
            icon="♧"
            title="Notification Settings"
            subtitle="Manage push notifications"
            onPress={() => navigation?.navigate(Routes.NOTIFICATIONS_SETTINGS)}
          />
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <View style={styles.card}>
          <SettingRow
            icon="♙"
            title="Edit Profile"
            subtitle="Update your profile information"
            onPress={() => navigation?.navigate('EditProfile')}
          />

          <SettingRow
            icon="▣"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => navigation?.navigate('ChangePassword')}
          />

          <SettingRow
            icon="◇"
            title="Privacy"
            subtitle="Manage your privacy settings"
            onPress={() => navigation?.navigate('Privacy')}
          />

          <SettingRow
            icon="⇩"
            title="Data & Storage"
            subtitle="Manage cache and downloads"
            onPress={() => navigation?.navigate('DataStorage')}
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>SUPPORT</Text>

        <View style={styles.card}>
          <SettingRow
            icon="?"
            title="Help & Support"
            subtitle="FAQs and contact support"
            onPress={() => navigation?.navigate('HelpSupport')}
          />

          <SettingRow
            icon="☆"
            title="Rate Us"
            subtitle="Share your feedback"
            onPress={() => {}}
          />

          <SettingRow
            icon="ⓘ"
            title="About App"
            subtitle="Version 1.0.0"
            onPress={() => navigation?.navigate('About')}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.logoutButton}
          onPress={() => {}}
        >
          <Text style={styles.logoutIcon}>⇥</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>QuoteCreator • Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },

  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 34,
    lineHeight: 36,
    color: '#171717',
    fontWeight: '300',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151515',
  },

  headerRight: {
    width: 36,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7437E8',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEF2',
    overflow: 'hidden',
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F4',
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
    color: '#7437E8',
    fontSize: 21,
    fontWeight: '600',
  },

  rowContent: {
    flex: 1,
    paddingVertical: 10,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#191919',
    marginBottom: 4,
  },

  rowSubtitle: {
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
    marginRight: 7,
  },

  arrow: {
    fontSize: 25,
    color: '#8C8C93',
    fontWeight: '300',
  },

  logoutButton: {
    height: 58,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEEEF2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 2,
  },

  logoutIcon: {
    fontSize: 23,
    color: '#EF3340',
    marginRight: 9,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF3340',
  },

  version: {
    textAlign: 'center',
    fontSize: 11,
    color: '#A0A0A6',
    marginTop: 18,
  },
});
