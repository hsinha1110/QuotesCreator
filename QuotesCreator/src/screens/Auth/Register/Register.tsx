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
import useStyles from './styles';
import styles from './styles';

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // ==========================================
  // FORM STATES
  // ==========================================

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  const [profileImage, setProfileImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);

  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  // ==========================================
  // ERROR STATES
  // ==========================================

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // ==========================================
  // CAMERA
  // ==========================================

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

  // ==========================================
  // GALLERY
  // ==========================================

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

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async () => {
    let isValid = true;

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // ========================================
    // NAME
    // ========================================

    if (!name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    }

    // ========================================
    // EMAIL
    // ========================================

    if (!email.trim()) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    // ========================================
    // PASSWORD
    // ========================================

    if (!password.trim()) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    // ========================================
    // CONFIRM PASSWORD
    // ========================================

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // ========================================
    // REGISTER API
    // ========================================

    try {
      const result = await dispatch(
        registerAsyncThunk({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          profileImage,
        }),
      ).unwrap();

      console.log('REGISTER SUCCESS:', result);

      // Go to Login after registration
      navigate(Routes.LOGIN);
    } catch (error) {
      console.log('REGISTER ERROR:', error);
    }
  };

  // ==========================================
  // GOOGLE
  // ==========================================

  const handleGoogleLogin = () => {
    console.log('Google Login');
  };

  // ==========================================
  // FACEBOOK
  // ==========================================

  const handleFacebookLogin = () => {
    console.log('Facebook Login');
  };

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

          {/* Photo Title */}

          <Text style={styles.photoTitle}>
            {profileImage ? 'Change Profile Photo' : 'Add Profile Photo'}
          </Text>

          <Text style={styles.photoSubtitle}>
            {profileImage
              ? 'Tap to choose another photo'
              : 'Upload your profile photo'}
          </Text>

          {/* =====================================
              HEADER
          ===================================== */}

          <View style={styles.header}>
            <Text style={styles.title}>Create Account ✨</Text>

            <Text style={styles.subtitle}>
              Sign up to start creating amazing quotes
            </Text>
          </View>

          {/* =====================================
              NAME
          ===================================== */}

          <InputComponent
            leftIcon="person-outline"
            placeholder="Enter your name"
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
            placeholder="Enter your email"
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
            placeholder="Create a password"
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
            placeholder="Confirm your password"
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
              CREATE ACCOUNT
          ===================================== */}

          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? 'Creating Account...' : 'Create Account'}
              onPress={handleRegister}
              disabled={isLoading}
            />
          </View>

          {/* =====================================
              API ERROR
          ===================================== */}

          {/* =====================================
              DIVIDER
          ===================================== */}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>or continue with</Text>

            <View style={styles.divider} />
          </View>

          {/* =====================================
              SOCIAL BUTTONS
          ===================================== */}

          <View style={styles.socialContainer}>
            <SocialButton
              title="Google"
              icon={<GoogleIcon size={19} />}
              onPress={handleGoogleLogin}
            />

            <SocialButton
              title="Facebook"
              icon={<FacebookIcon size={19} />}
              onPress={handleFacebookLogin}
            />
          </View>

          {/* =====================================
              LOGIN FOOTER
          ===================================== */}

          <AuthFooter
            text="Already have an account?"
            linkText="Login"
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
