import { createAsyncThunk } from '@reduxjs/toolkit';
import { registerDeviceService } from '../services/registerDeviceService';
import { ASYNC_ROUTES } from '../constants';
import { RegisterDeviceData } from '@/types';

export const registerDeviceThunk = createAsyncThunk(
  ASYNC_ROUTES.REGISTER_DEVICE,

  async (data: RegisterDeviceData, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();

      console.log('🔥 AUTH STATE:', state.auth);

      const token = state.auth?.token;

      console.log('🔑 REGISTER DEVICE TOKEN:', token ? 'Available' : 'Missing');

      if (!token) {
        return rejectWithValue('Token not provided');
      }

      const response = await registerDeviceService(data, token);

      return response;
    } catch (error: any) {
      console.log(
        '❌ Register Device Thunk Error:',
        error?.response?.data || error?.message,
      );

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to register device',
      );
    }
  },
);
