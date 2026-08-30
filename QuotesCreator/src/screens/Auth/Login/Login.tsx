import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { loginAsyncThunk } from '@/redux/thunk/loginThunk';
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

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { googleLogin, facebookLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    if (!email.trim()) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
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
      console.log('NORMAL LOGIN STARTED');

      const result = await dispatch(
        loginAsyncThunk({
          email: email.trim().toLowerCase(),
          password,
        }),
      ).unwrap();

      console.log('NORMAL LOGIN SUCCESS:', result);
    } catch (error: any) {
      console.log('NORMAL LOGIN ERROR:', error);

      const message = error?.message || error || 'Invalid email or password';

      Alert.alert('Login Failed', String(message));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('================================');
      console.log('🔥 GOOGLE LOGIN BUTTON PRESSED');
      console.log('================================');

      const result = await googleLogin();

      console.log('✅ GOOGLE LOGIN SUCCESS:', result?.user?.email);

      console.log('🔥 FIREBASE UID:', result?.user?.uid);
    } catch (error: any) {
      console.log('❌ GOOGLE LOGIN ERROR:', error);

      const errorCode = error?.code;
      const errorMessage =
        error?.message || 'Something went wrong. Please try again.';

      console.log('GOOGLE ERROR CODE:', errorCode);
      console.log('GOOGLE ERROR MESSAGE:', errorMessage);

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
  const handleFacebookLogin = async () => {
    try {
      console.log('================================');
      console.log('🔥 FACEBOOK LOGIN BUTTON PRESSED');
      console.log('================================');

      const result = await facebookLogin();

      console.log('✅ FACEBOOK LOGIN SUCCESS:', result?.user?.email);

      console.log('🔥 FIREBASE UID:', result?.user?.uid);
    } catch (error: any) {
      console.log('❌ FACEBOOK LOGIN ERROR:', error);

      const errorCode = error?.code;
      const errorMessage =
        error?.message || 'Something went wrong. Please try again.';

      console.log('FACEBOOK ERROR CODE:', errorCode);

      console.log('FACEBOOK ERROR MESSAGE:', errorMessage);

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

  const handleForgotPassword = () => {
    navigate(Routes.FORGOT);
  };

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
