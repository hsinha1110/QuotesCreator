import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '@/components/Header/Header';
import { timeZoneData } from '@/constants/Data';
import { TimeZoneItem } from '@/types';
import COLORS from '@/constants/Colors';
import styles from './styles';
import { navigate } from '@/utils/NavigationUtils';
import Routes from '@/navigations/Routes';

const TimeZone = () => {
  const navigation = useNavigation();

  // Device ka current timezone default selected
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const [search, setSearch] = useState<string>('');

  // Search timezone
  const filteredTimeZones = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return timeZoneData;
    }

    return timeZoneData.filter(item =>
      item.label.toLowerCase().includes(query),
    );
  }, [search]);

  // Save timezone
  const handleSave = () => {
    console.log('🔥 SELECTED TIMEZONE:', selectedTimeZone);

    navigate(Routes.NOTIFICATIONS_SETTINGS, {
      timezone: selectedTimeZone,
    });
  };

  const renderTimeZone = ({ item }: { item: TimeZoneItem }) => {
    const isSelected = selectedTimeZone === item.value;

    return (
      <Pressable
        onPress={() => setSelectedTimeZone(item.value)}
        style={[styles.timeZoneRow, isSelected && styles.selectedTimeZoneRow]}
      >
        <Text
          style={[
            styles.timeZoneText,
            isSelected && styles.selectedTimeZoneText,
          ]}
        >
          {item.label}
        </Text>

        {/* RADIO BUTTON */}
        <View
          style={[styles.radioButton, isSelected && styles.radioButtonSelected]}
        >
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Timezone"
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        rightText="Save"
        onRightPress={handleSave}
        showNotification={false}
      />

      <View style={styles.content}>
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#77717F" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search time zone"
            placeholderTextColor="#9993A5"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* TITLE */}
        <Text style={styles.selectText}>Select Time Zone</Text>

        {/* TIMEZONE LIST */}
        <View style={styles.card}>
          <FlatList
            data={filteredTimeZones}
            renderItem={renderTimeZone}
            keyExtractor={item => item.value}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {/* INFO */}
        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="information-outline"
              size={18}
              color={COLORS.accent}
            />
          </View>

          <Text style={styles.infoText}>
            Your daily quote notification will be sent according to this
            timezone.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TimeZone;
