import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { DrawerNavigationProp } from '@react-navigation/drawer';

import { useDispatch, useSelector } from 'react-redux';

import Routes from '@/navigations/Routes';
import { DrawerParamList } from '@/navigations/types';

import { AppDispatch, RootState } from '@/redux/store';
import { getProfileThunk } from '@/redux/thunk/getProfileThunk';

import { logout } from '@/redux/slices/authSlice';

import { translations } from '@/language';

import COLORS from '@/constants/Colors';

import styles from './styles';

const Profile = () => {
  type ProfileNavigationProp = DrawerNavigationProp<DrawerParamList>;

  const navigation = useNavigation<ProfileNavigationProp>();

  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // LANGUAGE
  // ==========================================

  const language = useSelector((state: RootState) => state.language.language);

  const t = translations[language].PROFILE;

  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const isDark = themeMode === 'dark';

  // ==========================================
  // THEME COLORS
  // ==========================================

  const themeColors = {
    background: isDark ? '#121212' : COLORS.white,

    card: isDark ? '#1E1E1E' : COLORS.white,

    textPrimary: isDark ? '#FFFFFF' : '#171717',

    textSecondary: isDark ? '#BDBDBD' : '#777777',

    border: isDark ? '#303030' : '#EEEEEE',

    iconBackground: isDark ? '#2A2038' : '#F5F2FF',

    icon: isDark ? '#FFFFFF' : '#171717',

    profileBorder: isDark ? '#4A3A65' : '#E7DEFF',

    profileEmail: isDark ? '#E0D8F5' : '#EDE8FF',

    dangerBackground: isDark ? '#351F1F' : '#FFF1F1',

    danger: COLORS.red,

    ripple: isDark ? '#333333' : '#EEEEEE',

    logoutBackground: isDark ? '#241818' : '#FFFFFF',

    logoutBorder: isDark ? '#4A2828' : '#FFE0E0',

    logoutRipple: isDark ? '#402020' : '#FDECEC',
  };

  // ==========================================
  // REDUX
  // ==========================================

  const authUser = useSelector((state: RootState) => state.auth.user);

  const profileState = useSelector((state: RootState) => state.profile);

  const profileUser = profileState.user;

  // ==========================================
  // PROFILE DATA
  // ==========================================

  const profileName = profileUser?.name || authUser?.name || t.DEFAULT_USER;

  const profileEmail = profileUser?.email || authUser?.email || '';

  const profileImage =
    profileUser?.profileImage || authUser?.profileImage || null;

  // ==========================================
  // GET PROFILE
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      if (!authUser?.id) {
        console.log('❌ USER ID NOT FOUND');
        return;
      }

      console.log('🔄 GETTING LATEST PROFILE:', authUser.id);

      dispatch(getProfileThunk(authUser.id))
        .unwrap()
        .then(response => {
          console.log('✅ PROFILE API RESPONSE:', response);
        })
        .catch(error => {
          console.log('❌ PROFILE API ERROR:', error);
        });
    }, [dispatch, authUser?.id]),
  );

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleMyAccount = () => {
    console.log('MY ACCOUNT');
  };

  const handleEditProfile = () => {
    navigation.navigate(Routes.EDIT_PROFILE);
  };

  const handleChangePassword = () => {
    console.log('CHANGE PASSWORD');
  };

  const handleRateUs = () => {
    console.log('RATE US');
  };

  const handleShareApp = () => {
    console.log('SHARE APP');
  };

  const handleSettings = () => {
    navigation.navigate(Routes.SETTINGS);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    console.log('🔴 LOGOUT');

    dispatch(logout());

    navigation.reset({
      index: 0,
      routes: [
        {
          name: Routes.LOGIN,
        },
      ],
    });
  };

  // ==========================================
  // PROFILE ROW
  // ==========================================

  const ProfileRow = ({
    icon,
    title,
    onPress,
    danger = false,
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    danger?: boolean;
  }) => {
    return (
      <Pressable
        style={styles.profileRow}
        onPress={onPress}
        android_ripple={{
          color: danger ? themeColors.logoutRipple : themeColors.ripple,
        }}
      >
        <View style={styles.rowLeft}>
          <View
            style={[
              styles.rowIconContainer,
              {
                backgroundColor: danger
                  ? themeColors.dangerBackground
                  : themeColors.iconBackground,
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={20}
              color={danger ? themeColors.danger : themeColors.icon}
            />
          </View>

          <Text
            style={[
              styles.rowTitle,
              {
                color: danger ? themeColors.danger : themeColors.textPrimary,
              },
            ]}
          >
            {title}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={themeColors.textSecondary}
        />
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
          backgroundColor: themeColors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ==========================================
            PROFILE HEADER
        ========================================== */}

        <View
          style={[
            styles.profileHeader,
            {
              backgroundColor: COLORS.accent,
            },
          ]}
        >
          <View
            style={[
              styles.profileImageWrapper,
              {
                borderColor: themeColors.profileBorder,
                backgroundColor: themeColors.iconBackground,
              },
            ]}
          >
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.defaultProfile,
                  {
                    backgroundColor: themeColors.iconBackground,
                  },
                ]}
              >
                <Ionicons
                  name="person"
                  size={48}
                  color={themeColors.textSecondary}
                />
              </View>
            )}
          </View>

          <Text
            style={[
              styles.profileName,
              {
                color: COLORS.white,
              },
            ]}
          >
            {profileName}
          </Text>

          <Text
            style={[
              styles.profileEmail,
              {
                color: themeColors.profileEmail,
              },
            ]}
          >
            {profileEmail}
          </Text>
        </View>

        {/* ==========================================
            ACCOUNT
        ========================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? '#BFA7FF' : COLORS.accent,
            },
          ]}
        >
          {t.ACCOUNT}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <ProfileRow
            icon="person-outline"
            title={t.MY_ACCOUNT}
            onPress={handleMyAccount}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: themeColors.border,
              },
            ]}
          />

          <ProfileRow
            icon="create-outline"
            title={t.EDIT_PROFILE}
            onPress={handleEditProfile}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: themeColors.border,
              },
            ]}
          />

          <ProfileRow
            icon="lock-closed-outline"
            title={t.CHANGE_PASSWORD}
            onPress={handleChangePassword}
          />
        </View>

        {/* ==========================================
            GENERAL
        ========================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? '#BFA7FF' : COLORS.accent,
            },
          ]}
        >
          {t.GENERAL}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <ProfileRow
            icon="settings-outline"
            title={t.SETTINGS}
            onPress={handleSettings}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: themeColors.border,
              },
            ]}
          />

          <ProfileRow
            icon="star-outline"
            title={t.RATE_US}
            onPress={handleRateUs}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: themeColors.border,
              },
            ]}
          />

          <ProfileRow
            icon="share-social-outline"
            title={t.SHARE_APP}
            onPress={handleShareApp}
          />
        </View>

        {/* ==========================================
            LOGOUT
        ========================================== */}

        <Pressable
          style={[
            styles.logoutButton,
            {
              backgroundColor: themeColors.logoutBackground,
              borderColor: themeColors.logoutBorder,
            },
          ]}
          onPress={handleLogout}
          android_ripple={{
            color: themeColors.logoutRipple,
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color={themeColors.danger}
          />

          <Text
            style={[
              styles.logoutText,
              {
                color: themeColors.danger,
              },
            ]}
          >
            {t.LOGOUT}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
