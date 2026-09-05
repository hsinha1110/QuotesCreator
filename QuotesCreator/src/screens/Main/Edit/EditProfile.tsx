import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import Header from '@/components/Header/Header';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import ImagePickerModal from '@/components/Modal/ImagePicker';

import COLORS from '@/constants/Colors';

import { AppDispatch, RootState } from '@/redux/store';
import { updateProfileThunk } from '@/redux/thunk/updateProfileThunk';

import {
  clearProfile,
  updateProfileLocal,
} from '@/redux/slices/profileSlice';

import styles from './styles';

import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigations/types';

import { deleteAccountThunk } from '@/redux/thunk/deleteAccountThunk';
import Routes from '@/navigations/Routes';
import { logout } from '@/redux/slices/authSlice';

import { translations } from '@/language';

type ProfileNavigationProp =
  DrawerNavigationProp<DrawerParamList>;

const EditProfile = () => {
  // ==========================================
  // NAVIGATION / DISPATCH
  // ==========================================

  const navigation =
    useNavigation<ProfileNavigationProp>();

  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // LANGUAGE
  // ==========================================

  const language = useSelector(
    (state: RootState) => state.language.language,
  );

  const t = translations[language].EDIT_PROFILE;

  // ==========================================
  // STATE
  // ==========================================

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [showImagePicker, setShowImagePicker] =
    useState(false);

  // ==========================================
  // REDUX
  // ==========================================

  const authUser = useSelector(
    (state: RootState) => state.auth.user,
  );

  const token = useSelector(
    (state: RootState) => state.auth.token,
  );

  const profileState = useSelector(
    (state: RootState) => state.profile,
  );

  const profileUser = profileState.user;

  // ==========================================
  // CURRENT PROFILE DATA
  // ==========================================

  const currentName =
    profileUser?.name ||
    authUser?.name ||
    '';

  const currentEmail =
    profileUser?.email ||
    authUser?.email ||
    '';

  const currentProfileImage =
    profileUser?.profileImage ||
    authUser?.profileImage ||
    null;

  // ==========================================
  // LOAD EXISTING USER DATA
  // ==========================================

  useEffect(() => {
    setName(currentName);
    setEmail(currentEmail);
  }, [currentName, currentEmail]);

  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  const handleChangeProfilePicture = () => {
    setShowImagePicker(true);
  };

  // ==========================================
  // CAMERA
  // ==========================================

  const handleCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      console.log(
        '📸 CAMERA PATH:',
        image.path,
      );

      if (!image.path) {
        console.log(
          '❌ CAMERA PATH NOT FOUND',
        );
        return;
      }

      setProfileImage(image.path);
      setShowImagePicker(false);
    } catch (error: any) {
      console.log(
        '❌ CAMERA ERROR:',
        error,
      );
    }
  };

  // ==========================================
  // GALLERY
  // ==========================================

  const handleGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      console.log(
        '🖼️ GALLERY PATH:',
        image.path,
      );

      if (!image.path) {
        console.log(
          '❌ GALLERY PATH NOT FOUND',
        );
        return;
      }

      setProfileImage(image.path);
      setShowImagePicker(false);
    } catch (error: any) {
      console.log(
        '❌ GALLERY ERROR:',
        error,
      );
    }
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {
    if (!authUser?.id) {
      console.log(
        '❌ USER ID NOT FOUND',
      );
      return;
    }

    if (!name.trim()) {
      Alert.alert(
        t.VALIDATION,
        t.NAME_REQUIRED,
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        t.VALIDATION,
        t.EMAIL_REQUIRED,
      );
      return;
    }

    try {
      console.log(
        '🔄 UPDATING PROFILE...',
      );

      const result = await dispatch(
        updateProfileThunk({
          userId: authUser.id,

          name: name.trim(),

          email: email.trim(),

          profileImage: profileImage
            ? {
                uri: profileImage,
                type: 'image/jpeg',
                fileName: 'profile-image.jpg',
              }
            : null,
        }),
      ).unwrap();

      console.log(
        '✅ UPDATE PROFILE RESPONSE:',
        result,
      );

      const updatedUser =
        result?.user || result;

      dispatch(
        updateProfileLocal(updatedUser),
      );

      console.log(
        '✅ PROFILE REDUX UPDATED:',
        updatedUser,
      );

      Alert.alert(
        t.SUCCESS,
        t.PROFILE_UPDATED,
        [
          {
            text: t.OK,
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.log(
        '❌ UPDATE PROFILE ERROR:',
        error,
      );

      Alert.alert(
        t.ERROR,
        t.UPDATE_FAILED,
      );
    }
  };

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDeleteAccount = async () => {
    if (!authUser?.id || !token) {
      Alert.alert(
        t.ERROR,
        t.USER_INFO_NOT_FOUND,
      );
      return;
    }

    Alert.alert(
      t.DELETE_ACCOUNT_TITLE,
      t.DELETE_ACCOUNT_MESSAGE,
      [
        {
          text: t.CANCEL,
          style: 'cancel',
        },
        {
          text: t.DELETE,
          style: 'destructive',

          onPress: async () => {
            try {
              await dispatch(
                deleteAccountThunk({
                  userId: authUser.id,
                  token,
                }),
              ).unwrap();

              // Clear profile
              dispatch(clearProfile());

              // Logout user
              dispatch(logout());

              // Don't navigate manually here.
            } catch (error: any) {
              console.log(
                'DELETE ACCOUNT ERROR:',
                error,
              );

              Alert.alert(
                t.ERROR,
                error?.message ||
                  t.DELETE_FAILED,
              );
            }
          },
        },
      ],
    );
  };

  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    navigation.goBack();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t.HEADER_TITLE}
        icon="chevron-back"
        onMenuPress={handleBack}
        showNotification={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* ======================================
            PROFILE IMAGE
        ====================================== */}

        <View style={styles.profileSection}>
          <View
            style={styles.profileImageContainer}
          >
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : currentProfileImage ? (
              <Image
                source={{
                  uri: currentProfileImage,
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={styles.defaultProfile}
              >
                <Ionicons
                  name="person"
                  size={55}
                  color="#999999"
                />
              </View>
            )}

            <Pressable
              style={styles.cameraButton}
              onPress={
                handleChangeProfilePicture
              }
            >
              <Ionicons
                name="camera"
                size={18}
                color={COLORS.white}
              />
            </Pressable>
          </View>
        </View>

        {/* ======================================
            NAME
        ====================================== */}

        <Text style={styles.label}>
          {t.FULL_NAME}
        </Text>

        <Input
          value={name}
          onChangeText={setName}
          placeholder={
            t.FULL_NAME_PLACEHOLDER
          }
          leftIcon="person-outline"
        />

        {/* ======================================
            EMAIL
        ====================================== */}

        <Text style={styles.label}>
          {t.EMAIL}
        </Text>

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder={
            t.EMAIL_PLACEHOLDER
          }
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />

        {/* ======================================
            SAVE
        ====================================== */}

        <View
          style={styles.saveButtonContainer}
        >
          <Button
            title={t.SAVE_CHANGES}
            onPress={handleSave}
          />
        </View>

        {/* ======================================
            DELETE
        ====================================== */}

        <Pressable
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>
            {t.DELETE_ACCOUNT}
          </Text>
        </Pressable>
      </ScrollView>

      {/* ======================================
          IMAGE PICKER MODAL
      ====================================== */}

      <ImagePickerModal
        visible={showImagePicker}
        onClose={() =>
          setShowImagePicker(false)
        }
        onCamera={handleCamera}
        onGallery={handleGallery}
      />
    </SafeAreaView>
  );
};

export default EditProfile;