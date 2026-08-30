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
      try {
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
      } catch (error) {
        console.log('❌ Firebase Auth State Error:', error);

        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const googleLogin = async () => {
    try {
      console.log('🔥 GOOGLE LOGIN STARTED');

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

      const firebaseToken = await firebaseUser.getIdToken();

      console.log('🔥 FIREBASE TOKEN EXISTS:', !!firebaseToken);

      if (!firebaseToken) {
        throw new Error('Google Firebase token not found');
      }

      const mongoResponse = await dispatch(
        socialLoginThunk({
          firebaseUid: firebaseUser.uid,

          name: firebaseUser.displayName ?? '',

          email: firebaseUser.email ?? '',

          profileImage: firebaseUser.photoURL ?? null,

          provider: 'google',

          language: 'English',
        }),
      ).unwrap();

      console.log('🔥 GOOGLE MONGO RESPONSE:', mongoResponse);

      if (!mongoResponse?.success) {
        throw new Error(mongoResponse?.message || 'Social login failed');
      }

      if (!mongoResponse?.token) {
        throw new Error('Backend JWT token not received');
      }

      if (!mongoResponse?.user?.id) {
        throw new Error('MongoDB user ID not received');
      }

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

      console.log('🔥 GOOGLE AUTH SAVED TO REDUX');

      console.log('🔥 REDUX USER ID:', mongoResponse.user.id);

      return mongoResponse;
    } catch (error) {
      console.log('❌ Google Login Error:', error);

      throw error;
    }
  };

  // =====================================================
  // FACEBOOK LOGIN
  // =====================================================

  const facebookLogin = async () => {
    try {
      console.log('🔥 FACEBOOK LOGIN STARTED');

      const response = await facebookLoginService();

      const firebaseUser = response?.user;

      if (!firebaseUser) {
        throw new Error('Facebook Firebase user not found');
      }

      console.log('🔥 FACEBOOK FIREBASE UID:', firebaseUser.uid);

      const firebaseToken = await firebaseUser.getIdToken();

      if (!firebaseToken) {
        throw new Error('Facebook Firebase token not found');
      }

      console.log('🔥 FACEBOOK FIREBASE TOKEN EXISTS:', !!firebaseToken);

      const mongoResponse = await dispatch(
        socialLoginThunk({
          firebaseUid: firebaseUser.uid,

          name: firebaseUser.displayName ?? '',

          email: firebaseUser.email ?? '',

          profileImage:
            firebaseUser.photoURL ?? response?.user?.photoURL ?? null,

          provider: 'facebook',

          language: 'English',
        }),
      ).unwrap();

      console.log('🔥 FACEBOOK MONGO RESPONSE:', mongoResponse);

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

      dispatch(
        setAuth({
          token: mongoResponse.token,

          user: {
            id: mongoResponse.user.id,

            name: mongoResponse.user.name ?? firebaseUser.displayName ?? '',

            email: mongoResponse.user.email ?? firebaseUser.email ?? '',

            profileImage:
              mongoResponse.user.profileImage ??
              firebaseUser.photoURL ??
              response?.user?.photoURL ??
              null,

            language: mongoResponse.user.language ?? 'English',
          },
        }),
      );

      console.log('🔥 FACEBOOK AUTH SAVED TO REDUX');

      console.log('🔥 FACEBOOK MONGO USER ID:', mongoResponse.user.id);

      return mongoResponse;
    } catch (error) {
      console.log('❌ Facebook Login Error:', error);
      throw error;
    }
  };

  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

  const deleteAccount = async (): Promise<void> => {
    try {
      console.log('🔥 DELETE ACCOUNT STARTED');

      // MongoDB
      const response = await dispatch(deleteAccountThunk()).unwrap();

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete account');
      }

      console.log('✅ MONGODB USER DELETED');

      // Firebase
      const firebaseUser = firebaseAuth.currentUser;

      if (firebaseUser) {
        await firebaseUser.delete();

        console.log('✅ FIREBASE USER DELETED');
      }

      // Redux
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
  // NORMAL LOGOUT
  // =====================================================

  const logout = async (): Promise<void> => {
    try {
      console.log('🔥 LOGOUT STARTED');

      await logoutService();

      console.log('🔥 PROVIDER LOGOUT SUCCESS');
    } catch (error) {
      console.log('❌ Provider Logout Error:', error);
    } finally {
      setUser(null);

      dispatch(logoutRedux());

      console.log('🔥 REDUX AUTH CLEARED');

      console.log('🔥 USER COMPLETELY LOGGED OUT');
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
