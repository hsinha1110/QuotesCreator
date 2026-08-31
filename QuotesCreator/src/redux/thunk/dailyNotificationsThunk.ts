import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '@/redux/constants';
import { RootState } from '@/redux/store';
import { dailyNotificationService } from '../services/dailyNotificationService';

export const dailyNotificationsThunk = createAsyncThunk(
  ASYNC_ROUTES.DAILY_QUOTE,

  async (language: 'English' | 'Hindi', { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;

      if (!state.auth.token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await dailyNotificationService(language);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch daily quote',
      );
    }
  },
);
