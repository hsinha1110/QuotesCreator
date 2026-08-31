import React, { createContext, useContext, useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/redux/store';

import { setAuth, logout as logoutRedux } from '@/redux/slices/authSlice';

import {
  googleLogin as googleLoginService,
  facebookLogin as facebookLoginService,
  logout as logoutService,
} from '@/services/authServices';

import { AuthContextType, AuthProviderProps } from '@/types';

import { socialLoginThunk } from '@/redux/thunk/socialThunk';

import { deleteAccountThunk } from '@/redux/thunk/deleteAccountThunk';

const firebaseAuth = getAuth();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FIREBASE AUTH STATE
  // =====================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, firebaseUser => {
      console.log(
        '🔥 Firebase Auth State:',
        firebaseUser
          ? {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }
          : null,
      );

      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const googleLogin = async () => {
    try {
      console.log('================================');
      console.log('🔥 GOOGLE LOGIN STARTED');
      console.log('================================');

      // Firebase Google login
      const response = await googleLoginService();

      const firebaseUser = response?.user;

      if (!firebaseUser) {
        throw new Error('Google Firebase user not found');
      }

      console.log('🔥 GOOGLE FIREBASE USER:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
      });

      // Firebase ID Token
      const firebaseToken = await firebaseUser.getIdToken();

      if (!firebaseToken) {
        throw new Error('Google Firebase token not found');
      }

      console.log('🔥 GOOGLE FIREBASE TOKEN EXISTS:', !!firebaseToken);

      // =================================================
      // BACKEND SOCIAL LOGIN
      // =================================================

      const mongoResponse = await dispatch(
        socialLoginThunk({
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName ?? '',
          email: firebaseUser.email ?? '',
          profileImage: firebaseUser.photoURL ?? null,
          provider: 'facebook',
          language: 'English',
        }),
      ).unwrap();

      console.log('🔥 GOOGLE MONGO RESPONSE:', mongoResponse);

      // =================================================
      // VALIDATE BACKEND RESPONSE
      // =================================================

      if (!mongoResponse?.success) {
        throw new Error(mongoResponse?.message || 'Google social login failed');
      }

      if (!mongoResponse?.token) {
        throw new Error('Backend JWT token not received');
      }

      if (!mongoResponse?.user?.id) {
        throw new Error('MongoDB user ID not received');
      }

      // =================================================
      // SAVE REDUX AUTH
      // =================================================

      dispatch(
        setAuth({
          token: mongoResponse.token,

          user: {
            id: mongoResponse.user.id,

            name: mongoResponse.user.name ?? firebaseUser.displayName ?? '',

            email: mongoResponse.user.email ?? firebaseUser.email ?? '',

            profileImage:
              mongoResponse.user.profileImage ?? firebaseUser.photoURL ?? null,

            language: mongoResponse.user.language ?? 'English',
          },
        }),
      );

      console.log('✅ GOOGLE AUTH SAVED TO REDUX');

      console.log('🔥 MONGODB USER ID:', mongoResponse.user.id);

      return mongoResponse;
    } catch (error: any) {
      console.log(
        '❌ GOOGLE LOGIN ERROR:',
        error?.code,
        error?.message || error,
      );

      throw error;
    }
  };

  // =====================================================
  // FACEBOOK LOGIN
  // =====================================================

  const facebookLogin = async () => {
    try {
      console.log('================================');
      console.log('🔥 FACEBOOK LOGIN STARTED');
      console.log('================================');

      // Firebase Facebook login
      const response = await facebookLoginService();

      const firebaseUser = response?.user;

      if (!firebaseUser) {
        throw new Error('Facebook Firebase user not found');
      }

      console.log('🔥 FACEBOOK FIREBASE USER:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
      });

      // Firebase ID Token
      const firebaseToken = await firebaseUser.getIdToken();

      if (!firebaseToken) {
        throw new Error('Facebook Firebase token not found');
      }

      console.log('🔥 FACEBOOK FIREBASE TOKEN EXISTS:', !!firebaseToken);

      // =================================================
      // BACKEND SOCIAL LOGIN
      // =================================================

      const mongoResponse = await dispatch(
        socialLoginThunk({
          firebaseUid: firebaseUser.uid,

          name: firebaseUser.displayName ?? '',

          email: firebaseUser.email ?? '',

          profileImage: firebaseUser.photoURL ?? null,

          provider: 'facebook',

          language: 'English',
        }),
      ).unwrap();

      console.log('🔥 FACEBOOK MONGO RESPONSE:', mongoResponse);

      // =================================================
      // VALIDATE BACKEND RESPONSE
      // =================================================

      if (!mongoResponse?.success) {
        throw new Error(
          mongoResponse?.message || 'Facebook social login failed',
        );
      }

      if (!mongoResponse?.token) {
        throw new Error('Backend JWT token not received');
      }

      if (!mongoResponse?.user?.id) {
        throw new Error('MongoDB user ID not received');
      }

      // =================================================
      // SAVE REDUX AUTH
      // =================================================

      dispatch(
        setAuth({
          token: mongoResponse.token,
          user: {
            id: mongoResponse.user.id,
            name: mongoResponse.user.name ?? firebaseUser.displayName ?? '',
            email: mongoResponse.user.email ?? firebaseUser.email ?? '',
            profileImage:
              mongoResponse.user.profileImage ?? firebaseUser.photoURL ?? null,
            language: mongoResponse.user.language ?? 'English',
          },
        }),
      );

      console.log('✅ FACEBOOK AUTH SAVED TO REDUX');

      console.log('🔥 MONGODB USER ID:', mongoResponse.user.id);

      return mongoResponse;
    } catch (error: any) {
      console.log(
        '❌ FACEBOOK LOGIN ERROR:',
        error?.code,
        error?.message || error,
      );

      throw error;
    }
  };

  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

  const deleteAccount = async (): Promise<void> => {
    try {
      console.log('🔥 DELETE ACCOUNT STARTED');

      // -----------------------------------------------
      // 1. DELETE MONGODB ACCOUNT
      // -----------------------------------------------

      const response = await dispatch(deleteAccountThunk()).unwrap();

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete account');
      }

      console.log('✅ MONGODB USER DELETED');

      // -----------------------------------------------
      // 2. DELETE FIREBASE ACCOUNT
      // -----------------------------------------------

      const firebaseUser = firebaseAuth.currentUser;

      if (firebaseUser) {
        await firebaseUser.delete();

        console.log('✅ FIREBASE USER DELETED');
      }

      // -----------------------------------------------
      // 3. CLEAR LOCAL STATE
      // -----------------------------------------------

      setUser(null);

      dispatch(logoutRedux());

      console.log('✅ REDUX CLEARED');

      console.log('✅ ACCOUNT COMPLETELY DELETED');
    } catch (error: any) {
      console.log('❌ DELETE ACCOUNT ERROR:', error?.code, error?.message);

      throw error;
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async (): Promise<void> => {
    try {
      console.log('🔥 LOGOUT STARTED');

      await logoutService();

      console.log('✅ FIREBASE LOGOUT SUCCESS');
    } catch (error: any) {
      console.log('❌ PROVIDER LOGOUT ERROR:', error?.code, error?.message);
    } finally {
      // Always clear local state
      setUser(null);

      dispatch(logoutRedux());

      console.log('✅ REDUX AUTH CLEARED');
    }
  };

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        googleLogin,
        facebookLogin,

        logout,

        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// HOOK
// =====================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
