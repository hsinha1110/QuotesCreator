import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import InputComponent from '@/components/Input/Input';
import AuthFooter from '@/components/AuthFooter/AuthFooter';
import Button from '@/components/Button/Button';
import SocialButton from '@/components/SocialButton/SocialButton';
import ImagePickerModal from '@/components/Modal/ImagePicker';

import GoogleIcon from '@/assets/icons/GoogleIcon';
import FacebookIcon from '@/assets/icons/FacebookIcon';

import COLORS from '@/constants/Colors';
import { moderateScale } from '@/styles/scaling';

import { navigate } from '@/utils/NavigationUtils';
import Routes from '@/navigations/Routes';

import { AppDispatch, RootState } from '@/redux/store';

import { registerAsyncThunk } from '@/redux/thunk/registerThunk';

import { translations } from '@/language';

import styles from './styles';

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();

  // =====================================================
  // AUTH STATE
  // =====================================================

  const { isLoading } = useSelector((state: RootState) => state.auth);

  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector((state: RootState) => state.language.language);

  const t = translations[language].SIGNUP;

  // =====================================================
  // FORM STATES
  // =====================================================

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const [profileImage, setProfileImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);

  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  // =====================================================
  // ERROR STATES
  // =====================================================

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // =====================================================
  // CAMERA
  // =====================================================

  const handleCamera = async () => {
    try {
      setImagePickerVisible(false);

      const image = await ImagePicker.openCamera({
        width: 600,
        height: 600,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      setProfileImage({
        uri: image.path,
        type: image.mime,
        name: `profile_${Date.now()}.jpg`,
      });
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        console.log('Camera error:', error);
      }
    }
  };

  // =====================================================
  // GALLERY
  // =====================================================

  const handleGallery = async () => {
    try {
      setImagePickerVisible(false);

      const image = await ImagePicker.openPicker({
        width: 600,
        height: 600,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      setProfileImage({
        uri: image.path,
        type: image.mime,
        name: `profile_${Date.now()}.jpg`,
      });
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        console.log('Gallery error:', error);
      }
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async () => {
    let isValid = true;

    // Clear previous errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // ===================================================
    // NAME VALIDATION
    // ===================================================

    if (!name.trim()) {
      setNameError(t.NAME_REQUIRED);
      isValid = false;
    }

    // ===================================================
    // EMAIL VALIDATION
    // ===================================================

    if (!email.trim()) {
      setEmailError(t.EMAIL_REQUIRED);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError(t.INVALID_EMAIL);
      isValid = false;
    }

    // ===================================================
    // PASSWORD VALIDATION
    // ===================================================

    if (!password.trim()) {
      setPasswordError(t.PASSWORD_REQUIRED);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t.INVALID_PASSWORD);
      isValid = false;
    }

    // ===================================================
    // CONFIRM PASSWORD VALIDATION
    // ===================================================

    if (!confirmPassword.trim()) {
      setConfirmPasswordError(t.CONFIRM_PASSWORD_REQUIRED);
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(t.PASSWORD_NOT_MATCH);
      isValid = false;
    }

    // ===================================================
    // STOP IF INVALID
    // ===================================================

    if (!isValid) {
      return;
    }

    // ===================================================
    // REGISTER API
    // ===================================================

    try {
      const result = await dispatch(
        registerAsyncThunk({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          profileImage,
        }),
      ).unwrap();

      console.log('REGISTER SUCCESS:', result);

      // =================================================
      // GO TO LOGIN
      // =================================================

      navigate(Routes.LOGIN);
    } catch (error: any) {
      console.log('REGISTER ERROR:', error);
    }
  };

  // =====================================================
  // GOOGLE
  // =====================================================

  const handleGoogleLogin = () => {
    console.log('Google Login');
  };

  // =====================================================
  // FACEBOOK
  // =====================================================

  const handleFacebookLogin = () => {
    console.log('Facebook Login');
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* =====================================
              PROFILE IMAGE
          ===================================== */}

          <TouchableOpacity
            style={styles.profileContainer}
            activeOpacity={0.8}
            onPress={() => setImagePickerVisible(true)}
          >
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage.uri,
                }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons
                  name="person"
                  size={moderateScale(48)}
                  color={COLORS.accent}
                />
              </View>
            )}

            {/* Camera Badge */}

            <View style={styles.cameraBadge}>
              <Ionicons
                name="camera"
                size={moderateScale(17)}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>

          {/* =====================================
              PHOTO TITLE
          ===================================== */}

          <Text style={styles.photoTitle}>
            {profileImage ? t.CHANGE_PROFILE_PHOTO : t.ADD_PROFILE_PHOTO}
          </Text>

          <Text style={styles.photoSubtitle}>
            {profileImage ? t.CHOOSE_ANOTHER_PHOTO : t.UPLOAD_PROFILE_PHOTO}
          </Text>

          {/* =====================================
              HEADER
          ===================================== */}

          <View style={styles.header}>
            <Text style={styles.title}>{t.TITLE}</Text>

            <Text style={styles.subtitle}>{t.SUBTITLE}</Text>
          </View>

          {/* =====================================
              NAME
          ===================================== */}

          <InputComponent
            leftIcon="person-outline"
            placeholder={t.NAME_PLACEHOLDER}
            value={name}
            onChangeText={text => {
              setName(text);

              if (nameError) {
                setNameError('');
              }
            }}
            autoCapitalize="words"
            error={nameError}
          />

          {/* =====================================
              EMAIL
          ===================================== */}

          <InputComponent
            leftIcon="mail-outline"
            placeholder={t.EMAIL_PLACEHOLDER}
            value={email}
            onChangeText={text => {
              setEmail(text);

              if (emailError) {
                setEmailError('');
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
          />

          {/* =====================================
              PASSWORD
          ===================================== */}

          <InputComponent
            leftIcon="lock-closed-outline"
            placeholder={t.PASSWORD_PLACEHOLDER}
            value={password}
            onChangeText={text => {
              setPassword(text);

              if (passwordError) {
                setPasswordError('');
              }
            }}
            isPassword
            error={passwordError}
          />

          {/* =====================================
              CONFIRM PASSWORD
          ===================================== */}

          <InputComponent
            leftIcon="lock-closed-outline"
            placeholder={t.CONFIRM_PASSWORD_PLACEHOLDER}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);

              if (confirmPasswordError) {
                setConfirmPasswordError('');
              }
            }}
            isPassword
            error={confirmPasswordError}
          />

          {/* =====================================
              SIGN UP BUTTON
          ===================================== */}

          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? t.CREATING_ACCOUNT : t.SIGNUP_BUTTON}
              onPress={handleRegister}
              disabled={isLoading}
            />
          </View>

          {/* =====================================
              DIVIDER
          ===================================== */}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>{t.OR_CONTINUE_WITH}</Text>

            <View style={styles.divider} />
          </View>

          {/* =====================================
              SOCIAL BUTTONS
          ===================================== */}

          <View style={styles.socialContainer}>
            <SocialButton
              title={t.GOOGLE}
              icon={<GoogleIcon size={19} />}
              onPress={handleGoogleLogin}
            />

            <SocialButton
              title={t.FACEBOOK}
              icon={<FacebookIcon size={19} />}
              onPress={handleFacebookLogin}
            />
          </View>

          {/* =====================================
              LOGIN FOOTER
          ===================================== */}

          <AuthFooter
            text={t.HAVE_ACCOUNT}
            linkText={t.LOGIN}
            onPress={() => navigate(Routes.LOGIN)}
          />
        </View>
      </ScrollView>

      {/* ==========================================
          IMAGE PICKER MODAL
      ========================================== */}

      <ImagePickerModal
        visible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onCamera={handleCamera}
        onGallery={handleGallery}
      />
    </KeyboardAvoidingView>
  );
};

export default Register;
