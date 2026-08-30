import { createAsyncThunk } from '@reduxjs/toolkit';
import { socialLoginService } from '@/redux/services/socialLoginService';
import { ASYNC_ROUTES } from '../constants';

interface SocialLoginPayload {
  firebaseUid: string;
  name: string;
  email: string;
  profileImage: string | null;
  provider: 'google' | 'facebook';
  language?: string;
}

export const socialLoginThunk = createAsyncThunk(
  ASYNC_ROUTES.SOCIAL_LOGIN,
  async (data: SocialLoginPayload, { rejectWithValue }) => {
    try {
      console.log('🔥 SOCIAL LOGIN THUNK:', data);

      const response = await socialLoginService({
        firebaseUid: data.firebaseUid,
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
        provider: data.provider,
        language: data.language ?? 'English',
      });

      console.log('🔥 SOCIAL LOGIN RESPONSE:', response);

      if (!response?.success) {
        return rejectWithValue(response?.message || 'Social login failed');
      }

      return response;
    } catch (error: any) {
      console.log('❌ SOCIAL LOGIN THUNK ERROR:', error);

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Social login failed',
      );
    }
  },
);
