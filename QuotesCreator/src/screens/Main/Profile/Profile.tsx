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

import styles from './styles';

const Profile = () => {
  type ProfileNavigationProp = DrawerNavigationProp<DrawerParamList>;

  const navigation = useNavigation<ProfileNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // REDUX
  // ==========================================

  const authUser = useSelector((state: RootState) => state.auth.user);

  const profileState = useSelector((state: RootState) => state.profile);

  const profileUser = profileState.user;

  // ==========================================
  // PROFILE DATA
  // ==========================================

  const profileName = profileUser?.name || authUser?.name || 'User';

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
        android_ripple={{ color: '#EEEEEE' }}
      >
        <View style={styles.rowLeft}>
          <View
            style={[
              styles.rowIconContainer,
              danger && styles.dangerIconContainer,
            ]}
          >
            <Ionicons
              name={icon}
              size={20}
              color={danger ? '#E53935' : '#171717'}
            />
          </View>

          <Text style={[styles.rowTitle, danger && styles.dangerText]}>
            {title}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={19} color="#777777" />
      </Pressable>
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROFILE HEADER */}

        <View style={styles.profileHeader}>
          <View style={styles.profileImageWrapper}>
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.defaultProfile}>
                <Ionicons name="person" size={48} color="#999999" />
              </View>
            )}
          </View>

          <Text style={styles.profileName}>{profileName}</Text>

          <Text style={styles.profileEmail}>{profileEmail}</Text>
        </View>

        {/* ACCOUNT */}

        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.card}>
          <ProfileRow
            icon="person-outline"
            title="My Account"
            onPress={handleMyAccount}
          />

          <View style={styles.divider} />

          <ProfileRow
            icon="create-outline"
            title="Edit Profile"
            onPress={handleEditProfile}
          />

          <View style={styles.divider} />

          <ProfileRow
            icon="lock-closed-outline"
            title="Change Password"
            onPress={handleChangePassword}
          />
        </View>

        {/* GENERAL */}

        <Text style={styles.sectionTitle}>General</Text>

        <View style={styles.card}>
          <ProfileRow
            icon="settings-outline"
            title="Settings"
            onPress={handleSettings}
          />

          <View style={styles.divider} />

          <ProfileRow
            icon="star-outline"
            title="Rate Us"
            onPress={handleRateUs}
          />

          <View style={styles.divider} />

          <ProfileRow
            icon="share-social-outline"
            title="Share App"
            onPress={handleShareApp}
          />
        </View>

        {/* LOGOUT */}

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          android_ripple={{ color: '#FDECEC' }}
        >
          <Ionicons name="log-out-outline" size={21} color="#E53935" />

          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
