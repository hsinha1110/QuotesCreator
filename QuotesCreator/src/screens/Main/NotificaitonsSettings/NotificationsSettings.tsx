import React, {useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
  DrawerActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';

import Header from '@/components/Header/Header';

import createStyles from './styles';

import Routes from '@/navigations/Routes';

import {navigate} from '@/utils/NavigationUtils';

import {
  AppDispatch,
  RootState,
} from '@/redux/store';

import {
  notificationSettingsThunk,
} from '@/redux/thunk/notificationsSettingsThunk';

import {translations} from '@/language';

import {THEME_COLORS} from '@/constants/Colors';

const NotificationsSettings = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();

  const route = useRoute<any>();

  // =========================
  // THEME
  // =========================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =========================
  // LANGUAGE
  // =========================

  const language = useSelector(
    (state: RootState) =>
      state.language.language,
  );

  const t =
    translations[language]
      .NOTIFICATION_SETTINGS;

  // =========================
  // TIMEZONE
  // =========================

  const [timezone, setTimezone] =
    useState<string>(
      route.params?.timezone ||
        Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone ||
        'Asia/Kolkata',
    );

  console.log(
    '✅ TIMEZONE:',
    timezone,
  );

  console.log(
    timezone,
    '....notifications Settings',
  );

  console.log(
    'Received timezone:',
    timezone,
  );

  // =========================
  // TIME
  // =========================

  const [selectedTime, setSelectedTime] =
    useState<Date>(new Date());

  const [showPicker, setShowPicker] =
    useState<boolean>(false);

  // =========================
  // TIME CHANGE
  // =========================

  const handleTimeChange = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (
      event.type === 'dismissed' ||
      !date
    ) {
      return;
    }

    setSelectedTime(date);
  };

  // =========================
  // FORMATTED TIME
  // =========================

  const formattedTime =
    selectedTime.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
    );

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    const hours =
      selectedTime.getHours();

    const minutes =
      selectedTime.getMinutes();

    const notificationTime =
      `${String(hours).padStart(
        2,
        '0',
      )}:${String(minutes).padStart(
        2,
        '0',
      )}`;

    const data = {
      dailyQuote: true,
      notificationTime,
      timezone:
        timezone || 'Asia/Kolkata',
    };

    console.log(
      '📦 API DATA:',
      data,
    );

    console.log(
      '🕐 UI TIME:',
      formattedTime,
    );

    try {
      const response =
        await dispatch(
          notificationSettingsThunk(
            data,
          ),
        ).unwrap();

      console.log(
        '✅ Notification Settings Saved:',
        response,
      );

      navigation.navigate(
        Routes.SETTINGS as never,
      );
    } catch (error) {
      console.log(
        '❌ Notification Settings Error:',
        error,
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <SafeAreaView
      style={styles.container}>
      
      {/* HEADER */}

      <Header
        title={t.TITLE}
        onMenuPress={() => {
          navigation.dispatch(
            DrawerActions.openDrawer(),
          );
        }}
        rightText={t.SAVE}
        onRightPress={handleSave}
        showNotification={false}
      />

      <View
        style={styles.timeContainer}>
        
        {/* TITLE */}

        <Text
          style={styles.timeTitle}>
          {t.SELECT_TIME}
        </Text>

        {/* SELECTED TIME */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.timeCard}
          onPress={() =>
            setShowPicker(true)
          }>
          
          <View>
            <Text
              style={
                styles.timeLabel
              }>
              {t.DAILY_QUOTE}
            </Text>

            <Text
              style={
                styles.timeValue
              }>
              {formattedTime}
            </Text>
          </View>

          <Text
            style={styles.editText}>
            {t.CHANGE}
          </Text>
        </TouchableOpacity>

        {/* TIME PICKER */}

        {showPicker && (
          <View
            style={
              styles.pickerContainer
            }>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="spinner"
              is24Hour={false}
              onChange={
                handleTimeChange
              }
              themeVariant={
                themeMode === 'dark'
                  ? 'dark'
                  : 'light'
              }
            />
          </View>
        )}

        {/* INFO */}

        <View
          style={
            styles.infoContainer
          }>
          
          <Text
            style={styles.infoIcon}>
            ⓘ
          </Text>

          <Text
            style={styles.infoText}>
            {t.INFO}
          </Text>
        </View>

        {/* TIMEZONE */}

        <Pressable
          style={
            styles.timezoneContainer
          }
          onPress={() => {
            navigate(
              Routes.TIME_ZONE,
              {
                currentTimezone:
                  timezone,
              },
            );
          }}>
          
          <Text
            style={
              styles.timezoneTitle
            }>
            {t.TIMEZONE}
          </Text>

          <Text
            style={
              styles.timezoneValue
            }>
            {timezone}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsSettings;