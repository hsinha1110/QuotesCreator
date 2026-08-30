import { createAsyncThunk } from '@reduxjs/toolkit';

import { registerService } from '@/redux/services/registerService';
import { RegisterPayload } from '@/types';
import { ASYNC_ROUTES } from '../constants';

export const registerAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.REGISTER,

  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await registerService(data);

      if (!response?.success) {
        return rejectWithValue(response?.message || 'Registration failed');
      }

      return response;
    } catch (error: any) {
      console.log('REGISTER API ERROR:', error?.response?.data || error);

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    }
  },
);
