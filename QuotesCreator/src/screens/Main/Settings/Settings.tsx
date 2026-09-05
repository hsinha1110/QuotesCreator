import Header from '@/components/Header/Header';
import Routes from '@/navigations/Routes';

import {setLanguage} from '@/redux/slices/languageSlice';
import {toggleTheme} from '@/redux/slices/themeSlice';

import {
  AppDispatch,
  RootState,
} from '@/redux/store';

import {
  SettingRowProps,
  SettingsProps,
} from '@/types';

import {goBack} from '@/utils/NavigationUtils';

import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';

import {translations} from '@/language';

const Settings = ({
  navigation,
}: SettingsProps) => {
  const dispatch =
    useDispatch<AppDispatch>();

  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector(
    (state: RootState) =>
      state.language.language,
  );

  const isHindi =
    language === 'Hindi';

  const t =
    translations[language].SETTINGS;

  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector(
    (state: RootState) =>
      state.theme.mode,
  );

  const isDark =
    themeMode === 'dark';

  // =====================================================
  // THEME COLORS
  // =====================================================

  const themeColors = {
    background: isDark
      ? '#121212'
      : '#FFFFFF',

    card: isDark
      ? '#1E1E1E'
      : '#FFFFFF',

    primaryText: isDark
      ? '#FFFFFF'
      : '#191919',

    secondaryText: isDark
      ? '#BDBDBD'
      : '#8A8A91',

    mutedText: isDark
      ? '#9E9E9E'
      : '#77777F',

    border: isDark
      ? '#303030'
      : '#EEEEF2',

    rowBorder: isDark
      ? '#303030'
      : '#F1F1F4',

    iconBackground: isDark
      ? '#2A2038'
      : '#F4EEFF',

    icon: '#7437E8',

    sectionTitle: '#7437E8',

    arrow: isDark
      ? '#BDBDBD'
      : '#8C8C93',

    version: isDark
      ? '#888888'
      : '#A0A0A6',
  };

  // =====================================================
  // THEME TOGGLE
  // =====================================================

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // =====================================================
  // LANGUAGE TOGGLE
  // =====================================================

  const handleLanguageToggle = async (
    value: boolean,
  ) => {
    const newLanguage =
      value
        ? 'Hindi'
        : 'English';

    dispatch(
      setLanguage(newLanguage),
    );

    try {
      await AsyncStorage.setItem(
        'APP_LANGUAGE',
        newLanguage,
      );

      console.log(
        'LANGUAGE SAVED:',
        newLanguage,
      );
    } catch (error) {
      console.log(
        'LANGUAGE SAVE ERROR:',
        error,
      );
    }
  };

  // =====================================================
  // SETTING ROW
  // =====================================================

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
        style={[
          styles.row,
          {
            borderBottomColor:
              themeColors.rowBorder,
          },
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        {/* ICON */}

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                themeColors.iconBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.icon,
              {
                color:
                  themeColors.icon,
              },
            ]}
          >
            {icon}
          </Text>
        </View>

        {/* CONTENT */}

        <View
          style={styles.rowContent}
        >
          <Text
            style={[
              styles.rowTitle,
              {
                color:
                  themeColors.primaryText,
              },
            ]}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              style={[
                styles.rowSubtitle,
                {
                  color:
                    themeColors.secondaryText,
                },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* RIGHT SIDE */}

        {rightComponent ? (
          rightComponent
        ) : (
          <View
            style={
              styles.rightContainer
            }
          >
            {value ? (
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      themeColors.mutedText,
                  },
                ]}
              >
                {value}
              </Text>
            ) : null}

            {showArrow ? (
              <Text
                style={[
                  styles.arrow,
                  {
                    color:
                      themeColors.arrow,
                  },
                ]}
              >
                ›
              </Text>
            ) : null}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {};

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            themeColors.background,
        },
      ]}
    >
      {/* HEADER */}

      <Header
        title={t.TITLE}
        icon="chevron-back"
        onMenuPress={goBack}
        showNotification={false}
        rightIcon=""
        onRightPress={handleSearch}
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* =====================================================
            PREFERENCES
        ===================================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                themeColors.sectionTitle,
            },
          ]}
        >
          {t.PREFERENCES}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                themeColors.card,

              borderColor:
                themeColors.border,
            },
          ]}
        >
          {/* LANGUAGE */}

          <SettingRow
            icon="◎"
            title={t.LANGUAGE}
            subtitle={
              t.LANGUAGE_SUBTITLE
            }
            showArrow={false}
            rightComponent={
              <View
                style={
                  styles.switchContainer
                }
              >
                <Text
                  style={[
                    styles.languageValue,
                    {
                      color:
                        themeColors.mutedText,
                    },
                  ]}
                >
                  {isHindi
                    ? t.HINDI
                    : t.ENGLISH}
                </Text>

                <Switch
                  value={isHindi}
                  onValueChange={
                    handleLanguageToggle
                  }
                  trackColor={{
                    false: '#D9D9E0',
                    true: '#CDB3FF',
                  }}
                  thumbColor={
                    isHindi
                      ? '#7437E8'
                      : '#FFFFFF'
                  }
                  ios_backgroundColor="#D9D9E0"
                />
              </View>
            }
          />

          {/* THEME */}

          <SettingRow
            icon="◉"
            title={t.THEME}
            subtitle={
              t.THEME_SUBTITLE
            }
            showArrow={false}
            rightComponent={
              <View
                style={
                  styles.switchContainer
                }
              >
                <Text
                  style={[
                    styles.languageValue,
                    {
                      color:
                        themeColors.mutedText,
                    },
                  ]}
                >
                  {isDark
                    ? t.DARK ?? 'Dark'
                    : t.LIGHT}
                </Text>

                <Switch
                  value={isDark}
                  onValueChange={
                    handleThemeToggle
                  }
                  trackColor={{
                    false: '#D9D9E0',
                    true: '#CDB3FF',
                  }}
                  thumbColor={
                    isDark
                      ? '#7437E8'
                      : '#FFFFFF'
                  }
                  ios_backgroundColor="#D9D9E0"
                />
              </View>
            }
          />

          {/* FONT SIZE */}

          <SettingRow
            icon="Aa"
            title={t.FONT_SIZE}
            subtitle={
              t.FONT_SIZE_SUBTITLE
            }
            value={t.MEDIUM}
            onPress={() =>
              navigation?.navigate(
                'FontSize',
              )
            }
          />

          {/* NOTIFICATION TIME */}

          <SettingRow
            icon="◷"
            title={
              t.NOTIFICATION_TIME
            }
            subtitle={
              t.NOTIFICATION_TIME_SUBTITLE
            }
            value="08:00 AM"
            onPress={() =>
              navigation?.navigate(
                'NotificationTime',
              )
            }
          />

          {/* NOTIFICATION SETTINGS */}

          <SettingRow
            icon="♧"
            title={
              t.NOTIFICATION_SETTINGS
            }
            subtitle={
              t.NOTIFICATION_SETTINGS_SUBTITLE
            }
            onPress={() =>
              navigation?.navigate(
                Routes.NOTIFICATIONS_SETTINGS,
              )
            }
          />
        </View>

        {/* =====================================================
            ACCOUNT
        ===================================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                themeColors.sectionTitle,
            },
          ]}
        >
          {t.ACCOUNT}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                themeColors.card,

              borderColor:
                themeColors.border,
            },
          ]}
        >
          <SettingRow
            icon="♙"
            title={t.EDIT_PROFILE}
            subtitle={
              t.EDIT_PROFILE_SUBTITLE
            }
            onPress={() =>
              navigation?.navigate(
                'EditProfile',
              )
            }
          />

          <SettingRow
            icon="▣"
            title={
              t.CHANGE_PASSWORD
            }
            subtitle={
              t.CHANGE_PASSWORD_SUBTITLE
            }
            onPress={() =>
              navigation?.navigate(
                'ChangePassword',
              )
            }
          />

          <SettingRow
            icon="◇"
            title={t.PRIVACY}
            subtitle={
              t.PRIVACY_SUBTITLE
            }
            onPress={() =>
              navigation?.navigate(
                'Privacy',
              )
            }
          />

          <SettingRow
            icon="⇩"
            title={
              t.DATA_STORAGE
            }
            subtitle={
              t.DATA_STORAGE_SUBTITLE
            }
            onPress={() =>
              navigation?.navigate(
                'DataStorage',
              )
            }
          />
        </View>

        {/* =====================================================
            SUPPORT
        ===================================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                themeColors.sectionTitle,
            },
          ]}
        >
          {t.SUPPORT}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                themeColors.card,

              borderColor:
                themeColors.border,
            },
          ]}
        >
          <SettingRow
            icon="?"
            title={t.HELP_SUPPORT}
            subtitle={
              t.HELP_SUPPORT_SUBTITLE
            }
            onPress={() =>
              navigation?.navigate(
                'HelpSupport',
              )
            }
          />

          <SettingRow
            icon="☆"
            title={t.RATE_US}
            subtitle={
              t.RATE_US_SUBTITLE
            }
            onPress={() => {}}
          />

          <SettingRow
            icon="ⓘ"
            title={t.ABOUT_APP}
            subtitle={t.VERSION}
            onPress={() =>
              navigation?.navigate(
                'About',
              )
            }
          />
        </View>

        {/* VERSION */}

        <Text
          style={[
            styles.version,
            {
              color:
                themeColors.version,
            },
          ]}
        >
          {t.APP_VERSION}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;