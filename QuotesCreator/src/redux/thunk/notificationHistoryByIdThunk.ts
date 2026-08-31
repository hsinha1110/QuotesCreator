import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { RootState } from '../store';
import { notificationsHistoryByIdService } from '../services/notificationsHistoryByIdService';

export const notificationHistoryByIdThunk = createAsyncThunk(
  ASYNC_ROUTES.NOTIFICATIONS_HISTORY_BY_ID,

  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;

      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      if (!userId) {
        return rejectWithValue('User ID not found');
      }

      const response = await notificationsHistoryByIdService(userId, token);

      return response;
    } catch (error: any) {
      console.log(
        '❌ Notification History By ID Error:',
        error?.response?.data || error,
      );

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to get notification history',
      );
    }
  },
);
