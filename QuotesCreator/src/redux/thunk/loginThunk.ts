import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginService } from '@/redux/services/loginService';
import { LoginPayload } from '@/types';
import { ASYNC_ROUTES } from '../constants';

export const loginAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.LOGIN,
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await loginService(data);

      if (!response?.success) {
        return rejectWithValue(response?.message || 'Login failed');
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    }
  },
);
