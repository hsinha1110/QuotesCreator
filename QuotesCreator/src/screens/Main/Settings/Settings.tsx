import Header from '@/components/Header/Header';
import Routes from '@/navigations/Routes';
import { setLanguage } from '@/redux/slices/languageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { SettingRowProps, SettingsProps } from '@/types';
import { goBack } from '@/utils/NavigationUtils';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const Settings = ({ navigation }: SettingsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const language = useSelector((state: RootState) => state.language.language);
  const isHindi = language === 'Hindi';

  const handleLanguageToggle = async (value: boolean) => {
    const newLanguage = value ? 'Hindi' : 'English';
    dispatch(setLanguage(newLanguage));
    try {
      await AsyncStorage.setItem('APP_LANGUAGE', newLanguage);

      console.log('LANGUAGE SAVED:', newLanguage);
    } catch (error) {
      console.log('LANGUAGE SAVE ERROR:', error);
    }
  };
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
  const handleSearch = () => {};
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title="Settings"
        icon="chevron-back"
        onMenuPress={goBack}
        showNotification={false}
        rightIcon=""
        onRightPress={handleSearch}
      />

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
            showArrow={false}
            rightComponent={
              <View style={styles.switchContainer}>
                <Text style={styles.languageValue}>
                  {isHindi ? 'Hindi' : 'English'}
                </Text>

                <Switch
                  value={isHindi}
                  onValueChange={handleLanguageToggle}
                  trackColor={{
                    false: '#D9D9E0',
                    true: '#CDB3FF',
                  }}
                  thumbColor={isHindi ? '#7437E8' : '#FFFFFF'}
                  ios_backgroundColor="#D9D9E0"
                />
              </View>
            }
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

        <Text style={styles.version}>QuoteCreator • Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
