import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, Platform } from 'react-native';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

import { loginAsyncThunk } from '@/redux/thunk/loginThunk';
import { registerDeviceThunk } from '@/redux/thunk/registerDeviceThunk';

import { useAuth } from '@/context/AuthContext';
import { navigate } from '@/utils/NavigationUtils';

import InputComponent from '@/components/Input/Input';
import AuthFooter from '@/components/AuthFooter/AuthFooter';
import SocialButton from '@/components/SocialButton/SocialButton';

import GoogleIcon from '@/assets/icons/GoogleIcon';
import FacebookIcon from '@/assets/icons/FacebookIcon';

import AuthLogo from '@/components/AuthLogo/AuthLogo';
import Button from '@/components/Button/Button';

import Routes from '@/navigations/Routes';
import styles from './styles';

import { RegisterDeviceData } from '@/types';

import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import { getMessaging, getToken } from '@react-native-firebase/messaging';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { googleLogin, facebookLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // =====================================================
  // REGISTER FCM DEVICE
  // =====================================================

  const registerFCMDevice = async (
    userId: string,
    language: 'English' | 'Hindi' = 'English',
  ) => {
    try {
      console.log('');
      console.log('================================');
      console.log('🔥 FCM DEVICE REGISTRATION STARTED');
      console.log('================================');

      // ---------------------------------------------
      // USER
      // ---------------------------------------------

      console.log('👤 USER ID:', userId);
      console.log('🌐 LANGUAGE:', language);
      console.log('📱 PLATFORM:', Platform.OS);

      if (!userId) {
        console.log('❌ USER ID MISSING');
        return;
      }

      // ---------------------------------------------
      // ANDROID 13+ NOTIFICATION PERMISSION
      // ---------------------------------------------

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log('🔔 Requesting Android notification permission...');

        const permission = await request(
          'android.permission.POST_NOTIFICATIONS' as any,
        );

        console.log('🔔 NOTIFICATION PERMISSION:', permission);

        if (permission !== RESULTS.GRANTED) {
          console.log('❌ NOTIFICATION PERMISSION NOT GRANTED');
          return;
        }

        console.log('✅ NOTIFICATION PERMISSION GRANTED');
      }

      // ---------------------------------------------
      // FIREBASE MESSAGING
      // ---------------------------------------------

      console.log('🔥 Creating Firebase Messaging...');

      const messaging = getMessaging();

      console.log('✅ Firebase Messaging initialized');

      // ---------------------------------------------
      // GET FCM TOKEN
      // ---------------------------------------------

      console.log('🔥 Getting FCM token...');

      const fcmToken = await getToken(messaging);

      console.log('🔥 FCM TOKEN:', fcmToken);

      if (!fcmToken) {
        console.log('❌ FCM TOKEN NOT AVAILABLE');
        return;
      }

      // ---------------------------------------------
      // PLATFORM
      // ---------------------------------------------

      const platform: 'ios' | 'android' =
        Platform.OS === 'ios' ? 'ios' : 'android';

      console.log('📱 REGISTER PLATFORM:', platform);

      // ---------------------------------------------
      // DEVICE DATA
      // ---------------------------------------------

      const deviceData: RegisterDeviceData = {
        userId,
        fcmToken,
        platform,
        language,
      };

      console.log('📦 REGISTER DEVICE DATA:', deviceData);

      // ---------------------------------------------
      // API CALL
      // ---------------------------------------------

      console.log('🚀 Calling registerDeviceThunk...');

      const response = await dispatch(registerDeviceThunk(deviceData)).unwrap();

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      console.log('');
      console.log('================================');
      console.log('✅ REGISTER DEVICE SUCCESS');
      console.log('✅ REGISTER DEVICE RESPONSE:', response);
      console.log('================================');
      console.log('');

      return response;
    } catch (error: any) {
      // ---------------------------------------------
      // ERROR
      // ---------------------------------------------

      console.log('');
      console.log('================================');
      console.log('❌ REGISTER FCM DEVICE ERROR');
      console.log('================================');

      console.log('❌ ERROR:', error);

      console.log('❌ ERROR MESSAGE:', error?.message);

      console.log('❌ ERROR RESPONSE:', error?.response?.data);

      console.log('❌ ERROR CODE:', error?.code);

      console.log('================================');
    }
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleLogin = async () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');

    // ---------------------------------------------
    // Email validation
    // ---------------------------------------------

    if (!email.trim()) {
      setEmailError('Please enter your email');

      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email');

      isValid = false;
    }

    // ---------------------------------------------
    // Password validation
    // ---------------------------------------------

    if (!password.trim()) {
      setPasswordError('Please enter your password');

      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');

      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      console.log('');
      console.log('================================');

      console.log('🔥 NORMAL LOGIN STARTED');

      console.log('================================');

      // ---------------------------------------------
      // Login API
      // ---------------------------------------------

      const result = await dispatch(
        loginAsyncThunk({
          email: email.trim().toLowerCase(),

          password,
        }),
      ).unwrap();

      console.log('✅ NORMAL LOGIN SUCCESS:', result);

      // ---------------------------------------------
      // Get user
      // ---------------------------------------------

      const user = result?.user;

      console.log('👤 LOGIN USER:', user);

      console.log('🆔 USER ID:', user?.id);

      console.log('🔑 TOKEN:', result?.token ? 'AVAILABLE' : 'MISSING');

      // ---------------------------------------------
      // Register FCM
      // ---------------------------------------------

      if (user?.id) {
        await registerFCMDevice(user.id, user.language || 'English');
      } else {
        console.log('❌ FCM REGISTRATION SKIPPED - USER ID MISSING');
      }

      console.log('✅ LOGIN FLOW COMPLETED');
    } catch (error: any) {
      console.log('❌ NORMAL LOGIN ERROR:', error);

      const message = error?.message || error || 'Invalid email or password';

      Alert.alert('Login Failed', String(message));
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async () => {
    try {
      console.log('');
      console.log('================================');

      console.log('🔥 GOOGLE LOGIN BUTTON PRESSED');

      console.log('================================');

      const result = await googleLogin();

      console.log('✅ GOOGLE LOGIN SUCCESS:', result?.user?.email);

      console.log('🔥 FIREBASE UID:', result?.user?.uid);

      console.log('🔥 GOOGLE RESULT:', result);

      /*
        IMPORTANT:

        googleLogin() agar backend se
        user + token return karta hai:

        await registerFCMDevice(
          result.backendUser.id,
          result.backendUser.language || 'English',
        );

        Agar googleLogin sirf Firebase user return
        karta hai, to backend user ID/JWT available
        karne ke baad registration karna hoga.
      */
    } catch (error: any) {
      console.log('❌ GOOGLE LOGIN ERROR:', error);

      const errorCode = error?.code;

      const errorMessage =
        error?.message || 'Something went wrong. Please try again.';

      if (
        errorCode === 'SIGN_IN_CANCELLED' ||
        errorCode === 'auth/cancelled-popup-request' ||
        errorCode === 'auth/popup-closed-by-user'
      ) {
        return;
      }

      if (errorCode === 'ERR_NETWORK' || errorCode === 'NETWORK_ERROR') {
        Alert.alert(
          'Network Error',
          'Please check your internet connection and try again.',
        );

        return;
      }

      Alert.alert('Google Login Failed', errorMessage);
    }
  };

  // =====================================================
  // FACEBOOK LOGIN
  // =====================================================

  const handleFacebookLogin = async () => {
    try {
      console.log('');
      console.log('================================');

      console.log('🔥 FACEBOOK LOGIN BUTTON PRESSED');

      console.log('================================');

      const result = await facebookLogin();

      console.log('✅ FACEBOOK LOGIN SUCCESS:', result?.user?.email);

      console.log('🔥 FIREBASE UID:', result?.user?.uid);

      console.log('🔥 FACEBOOK RESULT:', result);

      /*
        Backend user + token milne ke baad:

        await registerFCMDevice(
          result.backendUser.id,
          result.backendUser.language || 'English',
        );
      */
    } catch (error: any) {
      console.log('❌ FACEBOOK LOGIN ERROR:', error);

      const errorCode = error?.code;

      const errorMessage =
        error?.message || 'Something went wrong. Please try again.';

      if (
        errorCode === 'SIGN_IN_CANCELLED' ||
        errorCode === 'auth/cancelled' ||
        errorCode === 'auth/popup-closed-by-user'
      ) {
        return;
      }

      if (errorCode === 'ERR_NETWORK' || errorCode === 'NETWORK_ERROR') {
        Alert.alert(
          'Network Error',
          'Please check your internet connection and try again.',
        );

        return;
      }

      Alert.alert('Facebook Login Failed', errorMessage);
    }
  };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = () => {
    navigate(Routes.FORGOT);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AuthLogo />

        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back! 👋</Text>

          <Text style={styles.subtitle}>Login to continue to QuoteCreator</Text>
        </View>

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

        <InputComponent
          leftIcon="lock-closed-outline"
          placeholder="Enter your password"
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

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button title="Login" onPress={handleLogin} />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />

          <Text style={styles.dividerText}>or continue with</Text>

          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <SocialButton
            title="Google"
            icon={<GoogleIcon size={20} />}
            onPress={handleGoogleLogin}
          />

          <SocialButton
            title="Facebook"
            icon={<FacebookIcon size={20} />}
            onPress={handleFacebookLogin}
          />
        </View>

        <AuthFooter
          text="Don't have an account?"
          linkText="Sign Up"
          onPress={() => navigate(Routes.REGISTER)}
        />
      </View>
    </View>
  );
};

export default Login;
