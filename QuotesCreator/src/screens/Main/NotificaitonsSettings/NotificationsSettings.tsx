import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  DrawerActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';

import Header from '@/components/Header/Header';
import styles from './styles';
import Routes from '@/navigations/Routes';
import { navigate } from '@/utils/NavigationUtils';
import { notificationSettingsService } from '@/redux/services/notificationsSettingsService';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { notificationSettingsThunk } from '@/redux/thunk/notificationsSettingsThunk';

const NotificationsSettings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<any>();

  const [timezone, setTimezone] = useState<string>(
    route.params?.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      'Asia/Kolkata',
  );

  console.log('✅ TIMEZONE:', timezone);
  console.log(timezone, '....notifications Settings');
  console.log('Received timezone:', timezone);
  // Default notification time = 08:00 AM
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed' || !date) {
      return;
    }

    setSelectedTime(date);
  };

  const formattedTime = selectedTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const handleSave = async () => {
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();

    const notificationTime = `${String(hours).padStart(2, '0')}:${String(
      minutes,
    ).padStart(2, '0')}`;

    const data = {
      dailyQuote: true,
      notificationTime,
      timezone: timezone || 'Asia/Kolkata',
    };

    console.log('📦 API DATA:', data);
    console.log('🕐 UI TIME:', formattedTime);

    try {
      const response = await dispatch(notificationSettingsThunk(data)).unwrap();

      console.log('✅ Notification Settings Saved:', response);

      navigation.navigate(Routes.SETTINGS as never);
    } catch (error) {
      console.log('❌ Notification Settings Error:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications"
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        rightText="Save"
        onRightPress={handleSave}
        showNotification={false}
      />

      <View style={styles.timeContainer}>
        <Text style={styles.timeTitle}>
          Select the time you want to{'\n'}receive daily notifications
        </Text>

        {/* Selected Time */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.timeCard}
          onPress={() => setShowPicker(true)}
        >
          <View>
            <Text style={styles.timeLabel}>Daily Quote</Text>
            <Text style={styles.timeValue}>{formattedTime}</Text>{' '}
          </View>

          <Text style={styles.editText}>Change</Text>
        </TouchableOpacity>

        {/* Time Picker */}
        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="spinner"
              is24Hour={false}
              onChange={handleTimeChange}
            />
          </View>
        )}

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>ⓘ</Text>

          <Text style={styles.infoText}>
            You will receive your daily quote at this time every day.
          </Text>
        </View>

        {/* Timezone */}
        <Pressable
          style={styles.timezoneContainer}
          onPress={() => {
            navigate(Routes.TIME_ZONE, {
              currentTimezone: timezone,
            });
          }}
        >
          <Text style={styles.timezoneTitle}>Time Zone</Text>

          <Text style={styles.timezoneValue}>{timezone}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsSettings;
