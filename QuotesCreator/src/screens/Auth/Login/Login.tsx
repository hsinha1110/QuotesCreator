import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, Platform } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

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

import { request, RESULTS } from 'react-native-permissions';

import { getMessaging, getToken } from '@react-native-firebase/messaging';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { googleLogin, facebookLogin } = useAuth();

  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector((state: RootState) => state.language.language);

  const isHindi = language === 'Hindi';

  // =====================================================
  // LOCALIZED TEXT
  // =====================================================

  const loginText = {
    title: isHindi ? 'वापसी पर स्वागत है! 👋' : 'Welcome Back! 👋',

    subtitle: isHindi
      ? 'QuoteCreator जारी रखने के लिए लॉगिन करें'
      : 'Login to continue to QuoteCreator',

    emailPlaceholder: isHindi ? 'अपना ईमेल दर्ज करें' : 'Enter your email',

    passwordPlaceholder: isHindi
      ? 'अपना पासवर्ड दर्ज करें'
      : 'Enter your password',

    forgotPassword: isHindi ? 'पासवर्ड भूल गए?' : 'Forgot Password?',

    login: isHindi ? 'लॉगिन' : 'Login',

    orContinue: isHindi ? 'या इसके साथ जारी रखें' : 'or continue with',

    google: isHindi ? 'Google' : 'Google',

    facebook: isHindi ? 'Facebook' : 'Facebook',

    noAccount: isHindi ? 'क्या आपका अकाउंट नहीं है?' : "Don't have an account?",

    signup: isHindi ? 'साइन अप करें' : 'Sign Up',

    emailRequired: isHindi
      ? 'कृपया अपना ईमेल दर्ज करें'
      : 'Please enter your email',

    emailInvalid: isHindi
      ? 'कृपया एक मान्य ईमेल दर्ज करें'
      : 'Please enter a valid email',

    passwordRequired: isHindi
      ? 'कृपया अपना पासवर्ड दर्ज करें'
      : 'Please enter your password',

    passwordLength: isHindi
      ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए'
      : 'Password must be at least 6 characters',

    loginFailed: isHindi ? 'लॉगिन विफल' : 'Login Failed',

    invalidLogin: isHindi
      ? 'ईमेल या पासवर्ड गलत है'
      : 'Invalid email or password',

    networkError: isHindi ? 'नेटवर्क त्रुटि' : 'Network Error',

    checkInternet: isHindi
      ? 'कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।'
      : 'Please check your internet connection and try again.',

    googleFailed: isHindi ? 'Google लॉगिन विफल' : 'Google Login Failed',

    facebookFailed: isHindi ? 'Facebook लॉगिन विफल' : 'Facebook Login Failed',

    somethingWrong: isHindi
      ? 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
      : 'Something went wrong. Please try again.',
  };

  // =====================================================
  // FORM STATE
  // =====================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // =====================================================
  // REGISTER FCM DEVICE
  // =====================================================

  const registerFCMDevice = async (
    userId: string,
    selectedLanguage: 'English' | 'Hindi',
  ) => {
    try {
      console.log('');
      console.log('================================');
      console.log('🔥 FCM DEVICE REGISTRATION STARTED');
      console.log('================================');

      console.log('👤 USER ID:', userId);
      console.log('🌐 LANGUAGE:', selectedLanguage);
      console.log('📱 PLATFORM:', Platform.OS);

      if (!userId) {
        console.log('❌ USER ID MISSING');
        return;
      }

      // =================================================
      // ANDROID 13+ NOTIFICATION PERMISSION
      // =================================================

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

      // =================================================
      // FIREBASE MESSAGING
      // =================================================

      const messaging = getMessaging();

      console.log('✅ Firebase Messaging initialized');

      // =================================================
      // GET FCM TOKEN
      // =================================================

      const fcmToken = await getToken(messaging);

      console.log('🔥 FCM TOKEN:', fcmToken ? 'AVAILABLE' : 'MISSING');

      if (!fcmToken) {
        console.log('❌ FCM TOKEN NOT AVAILABLE');

        return;
      }

      // =================================================
      // PLATFORM
      // =================================================

      const platform: 'ios' | 'android' =
        Platform.OS === 'ios' ? 'ios' : 'android';

      // =================================================
      // DEVICE DATA
      // =================================================

      const deviceData: RegisterDeviceData = {
        userId,
        fcmToken,
        platform,
        language: selectedLanguage,
      };

      console.log('📦 REGISTER DEVICE DATA:', deviceData);

      // =================================================
      // REGISTER DEVICE
      // =================================================

      const response = await dispatch(registerDeviceThunk(deviceData)).unwrap();

      console.log('✅ REGISTER DEVICE SUCCESS:', response);

      return response;
    } catch (error: any) {
      console.log('❌ REGISTER FCM DEVICE ERROR:', error);

      console.log('❌ ERROR MESSAGE:', error?.message);

      console.log('❌ ERROR RESPONSE:', error?.response?.data);

      // FCM failure should not break login
      return null;
    }
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleLogin = async () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');

    // =================================================
    // EMAIL VALIDATION
    // =================================================

    if (!email.trim()) {
      setEmailError(loginText.emailRequired);

      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError(loginText.emailInvalid);

      isValid = false;
    }

    // =================================================
    // PASSWORD VALIDATION
    // =================================================

    if (!password.trim()) {
      setPasswordError(loginText.passwordRequired);

      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(loginText.passwordLength);

      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      console.log('🔥 NORMAL LOGIN STARTED');

      const result = await dispatch(
        loginAsyncThunk({
          email: email.trim().toLowerCase(),
          password,
        }),
      ).unwrap();

      console.log('✅ NORMAL LOGIN SUCCESS:', result);

      const user = result?.user;

      console.log('👤 LOGIN USER:', user);

      // =================================================
      // REGISTER FCM
      // IMPORTANT:
      // CURRENT REDUX LANGUAGE
      // =================================================

      if (user?.id) {
        await registerFCMDevice(user.id, language);
      }

      console.log('✅ LOGIN FLOW COMPLETED');
    } catch (error: any) {
      console.log('❌ NORMAL LOGIN ERROR:', error);

      const message = error?.message || loginText.invalidLogin;

      Alert.alert(loginText.loginFailed, String(message));
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async () => {
    try {
      console.log('🔥 GOOGLE LOGIN BUTTON PRESSED');

      const result = await googleLogin();

      console.log('✅ GOOGLE LOGIN SUCCESS:', result?.user?.email);

      const socialUserId =
        result?.userId ||
        result?.user?._id ||
        result?.user?.id ||
        result?.data?.user?._id ||
        result?.data?.user?.id;

      console.log('👤 SOCIAL BACKEND USER ID:', socialUserId);

      if (!socialUserId) {
        console.log('❌ BACKEND USER ID NOT FOUND');

        return;
      }

      // Current language
      await registerFCMDevice(socialUserId, language);

      console.log('✅ GOOGLE LOGIN + FCM REGISTRATION COMPLETED');
    } catch (error: any) {
      console.log('❌ GOOGLE LOGIN ERROR:', error);

      const errorCode = error?.code;

      const errorMessage = error?.message || loginText.somethingWrong;

      if (
        errorCode === 'SIGN_IN_CANCELLED' ||
        errorCode === 'auth/cancelled-popup-request' ||
        errorCode === 'auth/popup-closed-by-user'
      ) {
        return;
      }

      if (errorCode === 'ERR_NETWORK' || errorCode === 'NETWORK_ERROR') {
        Alert.alert(loginText.networkError, loginText.checkInternet);

        return;
      }

      Alert.alert(loginText.googleFailed, errorMessage);
    }
  };

  // =====================================================
  // FACEBOOK LOGIN
  // =====================================================

  const handleFacebookLogin = async () => {
    try {
      console.log('🔥 FACEBOOK LOGIN BUTTON PRESSED');

      const result = await facebookLogin();

      console.log('✅ FACEBOOK LOGIN SUCCESS:', result?.user?.email);

      const socialUserId =
        result?.userId ||
        result?.user?._id ||
        result?.user?.id ||
        result?.data?.user?._id ||
        result?.data?.user?.id;

      console.log('👤 SOCIAL BACKEND USER ID:', socialUserId);

      if (!socialUserId) {
        console.log('❌ BACKEND USER ID NOT FOUND');

        return;
      }

      // IMPORTANT:
      // DO NOT HARDCODE ENGLISH
      await registerFCMDevice(socialUserId, language);

      console.log('✅ FACEBOOK LOGIN + FCM REGISTRATION COMPLETED');
    } catch (error: any) {
      console.log('❌ FACEBOOK LOGIN ERROR:', error);

      const errorCode = error?.code;

      const errorMessage = error?.message || loginText.somethingWrong;

      if (
        errorCode === 'SIGN_IN_CANCELLED' ||
        errorCode === 'auth/cancelled' ||
        errorCode === 'auth/popup-closed-by-user'
      ) {
        return;
      }

      if (errorCode === 'ERR_NETWORK' || errorCode === 'NETWORK_ERROR') {
        Alert.alert(loginText.networkError, loginText.checkInternet);

        return;
      }

      Alert.alert(loginText.facebookFailed, errorMessage);
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
        {/* LOGO */}

        <AuthLogo />

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>{loginText.title}</Text>

          <Text style={styles.subtitle}>{loginText.subtitle}</Text>
        </View>

        {/* EMAIL */}

        <InputComponent
          leftIcon="mail-outline"
          placeholder={loginText.emailPlaceholder}
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

        {/* PASSWORD */}

        <InputComponent
          leftIcon="lock-closed-outline"
          placeholder={loginText.passwordPlaceholder}
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

        {/* FORGOT PASSWORD */}

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotText}>{loginText.forgotPassword}</Text>
        </TouchableOpacity>

        {/* LOGIN */}

        <Button title={loginText.login} onPress={handleLogin} />

        {/* DIVIDER */}

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />

          <Text style={styles.dividerText}>{loginText.orContinue}</Text>

          <View style={styles.divider} />
        </View>

        {/* SOCIAL LOGIN */}

        <View style={styles.socialContainer}>
          <SocialButton
            title={loginText.google}
            icon={<GoogleIcon size={20} />}
            onPress={handleGoogleLogin}
          />

          <SocialButton
            title={loginText.facebook}
            icon={<FacebookIcon size={20} />}
            onPress={handleFacebookLogin}
          />
        </View>

        {/* SIGN UP */}

        <AuthFooter
          text={loginText.noAccount}
          linkText={loginText.signup}
          onPress={() => navigate(Routes.REGISTER)}
        />
      </View>
    </View>
  );
};

export default Login;
