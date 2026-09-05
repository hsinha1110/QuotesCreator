import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useSelector} from 'react-redux';

import Header from '@/components/Header/Header';

import {timeZoneData} from '@/constants/Data';

import {TimeZoneItem} from '@/types';

import COLORS from '@/constants/Colors';

import {RootState} from '@/redux/store';

import {navigate} from '@/utils/NavigationUtils';

import Routes from '@/navigations/Routes';

import styles from './styles';

const TimeZone = () => {
  const navigation = useNavigation();

  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const isDark = themeMode === 'dark';

  // ==========================================
  // THEME COLORS
  // ==========================================

  const themeColors = {
    background: isDark
      ? '#121212'
      : COLORS.white,

    card: isDark
      ? '#1E1E1E'
      : COLORS.white,

    textPrimary: isDark
      ? '#FFFFFF'
      : COLORS.black,

    textSecondary: isDark
      ? '#BDBDBD'
      : '#625B6D',

    border: isDark
      ? '#303030'
      : '#EEEEF2',

    rowBorder: isDark
      ? '#303030'
      : '#F1F1F4',

    searchBackground: isDark
      ? '#1E1E1E'
      : '#FAF8FD',

    searchBorder: isDark
      ? '#353535'
      : '#EDE9F2',

    searchIcon: isDark
      ? '#BDBDBD'
      : '#77717F',

    placeholder: isDark
      ? '#777777'
      : '#9993A5',

    selectedRow: isDark
      ? '#2A2038'
      : '#F8F3FF',

    radioBorder: isDark
      ? '#666666'
      : '#C8C4CF',

    infoBackground: isDark
      ? '#251D32'
      : '#F8F3FF',

    infoIconBackground: isDark
      ? '#352849'
      : '#EEE3FF',
  };

  // ==========================================
  // DEVICE TIMEZONE
  // ==========================================

  const deviceTimeZone =
    Intl.DateTimeFormat().resolvedOptions()
      .timeZone;

  const [
    selectedTimeZone,
    setSelectedTimeZone,
  ] = useState<string>(
    deviceTimeZone,
  );

  const [search, setSearch] =
    useState<string>('');

  // ==========================================
  // SEARCH TIMEZONE
  // ==========================================

  const filteredTimeZones =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return timeZoneData;
      }

      return timeZoneData.filter(
        item =>
          item.label
            .toLowerCase()
            .includes(query),
      );
    }, [search]);

  // ==========================================
  // SAVE TIMEZONE
  // ==========================================

  const handleSave = () => {
    console.log(
      '🔥 SELECTED TIMEZONE:',
      selectedTimeZone,
    );

    navigate(
      Routes.NOTIFICATIONS_SETTINGS,
      {
        timezone: selectedTimeZone,
      },
    );
  };

  // ==========================================
  // TIMEZONE ITEM
  // ==========================================

  const renderTimeZone = ({
    item,
  }: {
    item: TimeZoneItem;
  }) => {
    const isSelected =
      selectedTimeZone === item.value;

    return (
      <Pressable
        onPress={() =>
          setSelectedTimeZone(
            item.value,
          )
        }
        style={[
          styles.timeZoneRow,
          {
            backgroundColor: isSelected
              ? themeColors.selectedRow
              : themeColors.card,

            borderBottomColor:
              themeColors.rowBorder,
          },
        ]}
        android_ripple={{
          color: themeColors.border,
        }}
      >
        <Text
          style={[
            styles.timeZoneText,
            {
              color: isSelected
                ? COLORS.accent
                : themeColors.textPrimary,
            },
          ]}
        >
          {item.label}
        </Text>

        {/* RADIO BUTTON */}

        <View
          style={[
            styles.radioButton,
            {
              borderColor: isSelected
                ? COLORS.accent
                : themeColors.radioBorder,
            },
          ]}
        >
          {isSelected && (
            <View
              style={[
                styles.radioButtonInner,
                {
                  backgroundColor:
                    COLORS.accent,
                },
              ]}
            />
          )}
        </View>
      </Pressable>
    );
  };

  // ==========================================
  // UI
  // ==========================================

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
      {/* ==========================================
          HEADER
      ========================================== */}

      <Header
        title="Timezone"
        onMenuPress={() => {
          navigation.dispatch(
            DrawerActions.openDrawer(),
          );
        }}
        rightText="Save"
        onRightPress={handleSave}
        showNotification={false}
      />

      {/* ==========================================
          CONTENT
      ========================================== */}

      <View
        style={[
          styles.content,
          {
            backgroundColor:
              themeColors.background,
          },
        ]}
      >
        {/* ==========================================
            SEARCH
        ========================================== */}

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor:
                themeColors.searchBackground,

              borderColor:
                themeColors.searchBorder,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={themeColors.searchIcon}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search time zone"
            placeholderTextColor={
              themeColors.placeholder
            }
            style={[
              styles.searchInput,
              {
                color:
                  themeColors.textPrimary,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* ==========================================
            TITLE
        ========================================== */}

        <Text
          style={[
            styles.selectText,
            {
              color:
                themeColors.textPrimary,
            },
          ]}
        >
          Select Time Zone
        </Text>

        {/* ==========================================
            TIMEZONE LIST
        ========================================== */}

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
          <FlatList
            data={filteredTimeZones}
            renderItem={renderTimeZone}
            keyExtractor={item =>
              item.value
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {/* ==========================================
            INFO
        ========================================== */}

        <View
          style={[
            styles.infoContainer,
            {
              backgroundColor:
                themeColors.infoBackground,
            },
          ]}
        >
          <View
            style={[
              styles.infoIcon,
              {
                backgroundColor:
                  themeColors.infoIconBackground,
              },
            ]}
          >
            <Ionicons
              name="information-outline"
              size={18}
              color={COLORS.accent}
            />
          </View>

          <Text
            style={[
              styles.infoText,
              {
                color:
                  themeColors.textSecondary,
              },
            ]}
          >
            Your daily quote notification
            will be sent according to this
            timezone.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TimeZone;